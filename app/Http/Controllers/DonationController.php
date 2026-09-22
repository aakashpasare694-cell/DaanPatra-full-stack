<?php

namespace App\Http\Controllers;

use App\Models\Donation;
use App\Services\ActivityLogger;
use App\Services\DonationService;
use App\Services\Notification\EmailReceiptService;
use App\Services\Notification\WhatsAppReceiptService;
use App\Services\Notification\SmsReceiptService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DonationController extends Controller
{
    protected DonationService $donationService;

    public function __construct(DonationService $donationService)
    {
        $this->donationService = $donationService;
    }

    public function index(Request $request)
    {
        $user = Auth::user();
        $trustId = (string) $user->trust_id;
        $user->load('trust');

        // Summary Widget stats
        $totalDonationsQuery = Donation::where('trust_id', $trustId);
        $totalAmount = (float) $totalDonationsQuery->sum('amount');
        
        $collectedAmount = (float) Donation::where('trust_id', $trustId)
            ->where('payment_status', 'Paid')
            ->sum('amount');

        $pendingAmount = (float) Donation::where('trust_id', $trustId)
            ->where('payment_status', 'Pending')
            ->sum('amount');

        $donorCount = Donation::where('trust_id', $trustId)->count();

        // Filters for donation list
        $search = $request->input('search');
        $status = $request->input('status');
        $method = $request->input('method');

        $donationsQuery = Donation::where('trust_id', $trustId);

        if ($search) {
            $donationsQuery->where(function ($q) use ($search) {
                $q->where('donor_name', 'LIKE', "%{$search}%")
                  ->orWhere('receipt_number', 'LIKE', "%{$search}%")
                  ->orWhere('donor_mobile', 'LIKE', "%{$search}%");
            });
        }

        if ($status && $status !== 'All') {
            $donationsQuery->where('payment_status', $status);
        }

        if ($method && $method !== 'All') {
            $donationsQuery->where('payment_method', $method);
        }

        $donations = $donationsQuery->orderBy('created_at', 'desc')->paginate(10)->withQueryString();

        // Pending donations list specifically for the pending workflow
        $pendingDonations = Donation::where('trust_id', $trustId)
            ->where('payment_status', 'Pending')
            ->orderBy('follow_up_date', 'asc')
            ->get();

        return Inertia::render('Donations/Index', [
            'auth' => [
                'user' => $user,
                'trust' => $user->trust,
            ],
            'summary' => [
                'totalAmount' => $totalAmount,
                'collectedAmount' => $collectedAmount,
                'pendingAmount' => $pendingAmount,
                'donorCount' => $donorCount,
            ],
            'donations' => $donations,
            'pendingDonations' => $pendingDonations,
            'filters' => [
                'search' => $search ?? '',
                'status' => $status ?? 'All',
                'method' => $method ?? 'All',
            ],
            'flash' => [
                'createdDonation' => session('createdDonation'),
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        if ($user->isNormal()) {
            return back()->with('error', 'Access Denied: Read-only members cannot create donation records.');
        }

        $validated = $request->validate([
            'donor_name' => 'required|string|max:255',
            'donor_mobile' => 'required|string|max:20',
            'donor_email' => 'nullable|email|max:255',
            'income_type' => 'nullable|string|max:255',
            'amount' => 'required|numeric|min:1',
            'amount_in_words' => 'nullable|string|max:255',
            'payment_method' => 'required|string|in:Cash,Online,QR Code,Cheque',
            'payment_status' => 'required|string|in:Paid,Pending',
            'follow_up_after_days' => 'nullable|required_if:payment_status,Pending|string',
            'collected_by' => 'required|string|max:255',
        ]);

        $trustId = (string) $user->trust_id;

        // Auto-generate receipt number
        $receiptNumber = $this->donationService->generateReceiptNumber($trustId);

        // Amount in words auto-generation if not supplied
        $amountInWords = !empty($validated['amount_in_words']) 
            ? $validated['amount_in_words'] 
            : $this->donationService->amountToWords((float)$validated['amount']);

        // Follow up date
        $followUpDate = null;
        if ($validated['payment_status'] === 'Pending') {
            $followUpDate = $this->donationService->calculateFollowUpDate($validated['follow_up_after_days'] ?? '1 Day');
        }

        $donation = Donation::create([
            'trust_id' => $trustId,
            'receipt_number' => $receiptNumber,
            'donor_name' => $validated['donor_name'],
            'donor_mobile' => $validated['donor_mobile'],
            'donor_email' => $validated['donor_email'] ?? null,
            'income_type' => $validated['income_type'] ?? 'Donation / Vargani',
            'amount' => (float) $validated['amount'],
            'amount_in_words' => $amountInWords,
            'payment_method' => $validated['payment_method'],
            'payment_status' => $validated['payment_status'],
            'follow_up_after_days' => $validated['follow_up_after_days'] ?? null,
            'follow_up_date' => $followUpDate,
            'collected_by' => $validated['collected_by'],
            'donation_date' => date('Y-m-d'),
            'paid_at' => $validated['payment_status'] === 'Paid' ? now() : null,
        ]);

        // Send initial notifications
        if (!empty($donation->donor_email)) {
            (new EmailReceiptService())->sendReceipt($donation);
        }
        (new WhatsAppReceiptService())->sendReceipt($donation);
        (new SmsReceiptService())->sendReceipt($donation);

        // Audit Log
        ActivityLogger::log(
            'DONATION_CREATED',
            "Recorded {$donation->income_type} of ₹{$donation->amount} from {$donation->donor_name} (Receipt #{$donation->receipt_number})",
            [
                'receipt_number' => $donation->receipt_number,
                'donor_name' => $donation->donor_name,
                'amount' => $donation->amount,
                'payment_method' => $donation->payment_method,
                'status' => $donation->payment_status,
            ]
        );

        return back()->with([
            'success' => 'Donation recorded successfully!',
            'createdDonation' => $donation,
        ]);
    }

    public function markAsPaid($id)
    {
        $user = Auth::user();
        if ($user->isNormal()) {
            return back()->with('error', 'Access Denied: Read-only members cannot update payment status.');
        }

        $trustId = (string) $user->trust_id;
        $donation = Donation::where('trust_id', $trustId)->where('_id', $id)->firstOrFail();

        $donation->update([
            'payment_status' => 'Paid',
            'paid_at' => now(),
            'follow_up_date' => null,
            'follow_up_after_days' => null,
        ]);

        // Audit Log
        ActivityLogger::log(
            'PAYMENT_MARKED_PAID',
            "Marked Receipt #{$donation->receipt_number} for {$donation->donor_name} (₹{$donation->amount}) as Paid",
            [
                'receipt_number' => $donation->receipt_number,
                'amount' => $donation->amount,
                'donor_name' => $donation->donor_name,
            ]
        );

        return back()->with('success', "Receipt #{$donation->receipt_number} marked as Paid.");
    }

    public function sendReceipt(Request $request, $id)
    {
        $user = Auth::user();
        if ($user->isNormal()) {
            return back()->with('error', 'Access Denied: Read-only members cannot re-send receipts.');
        }

        $trustId = (string) $user->trust_id;
        $donation = Donation::where('trust_id', $trustId)->where('_id', $id)->firstOrFail();
        $channel = $request->input('channel', 'email');

        if ($channel === 'email') {
            (new EmailReceiptService())->sendReceipt($donation);
            $msg = "Email receipt sent to {$donation->donor_email}.";
        } elseif ($channel === 'whatsapp') {
            (new WhatsAppReceiptService())->sendReceipt($donation);
            $msg = "WhatsApp receipt notification queued for {$donation->donor_mobile}.";
        } else {
            (new SmsReceiptService())->sendReceipt($donation);
            $msg = "SMS receipt notification queued for {$donation->donor_mobile}.";
        }

        // Audit Log
        ActivityLogger::log(
            'RECEIPT_SENT',
            "Dispatched digital receipt for #{$donation->receipt_number} via " . strtoupper($channel),
            ['receipt_number' => $donation->receipt_number, 'channel' => $channel]
        );

        return back()->with('success', $msg);
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();
        if ($user->isNormal()) {
            return back()->with('error', 'Access Denied: Read-only members cannot update records.');
        }

        $trustId = (string) $user->trust_id;
        $donation = Donation::where('trust_id', $trustId)->where('_id', $id)->firstOrFail();

        $validated = $request->validate([
            'donor_name' => 'required|string|max:255',
            'donor_mobile' => 'required|string|max:20',
            'donor_email' => 'nullable|email|max:255',
            'income_type' => 'nullable|string|max:255',
            'amount' => 'required|numeric|min:1',
            'amount_in_words' => 'nullable|string|max:255',
            'payment_method' => 'required|string|in:Cash,Online,QR Code,Cheque',
            'payment_status' => 'required|string|in:Paid,Pending',
            'collected_by' => 'required|string|max:255',
        ]);

        $donation->update($validated);

        // Audit Log
        ActivityLogger::log(
            'DONATION_UPDATED',
            "Updated donation record details for Receipt #{$donation->receipt_number}",
            ['receipt_number' => $donation->receipt_number, 'donor_name' => $donation->donor_name]
        );

        return back()->with('success', 'Donation details updated successfully.');
    }

    public function destroy($id)
    {
        $user = Auth::user();
        if ($user->isNormal()) {
            return back()->with('error', 'Access Denied: Read-only members cannot delete records.');
        }

        $trustId = (string) $user->trust_id;
        $donation = Donation::where('trust_id', $trustId)->where('_id', $id)->firstOrFail();
        $receiptNo = $donation->receipt_number;
        $donorName = $donation->donor_name;

        $donation->delete();

        // Audit Log
        ActivityLogger::log(
            'DONATION_DELETED',
            "Deleted donation record #{$receiptNo} ({$donorName})",
            ['receipt_number' => $receiptNo, 'donor_name' => $donorName]
        );

        return back()->with('success', 'Donation deleted successfully.');
    }
}
