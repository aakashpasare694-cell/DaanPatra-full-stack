<?php

namespace App\Services\Notification;

use App\Models\Donation;
use Illuminate\Support\Facades\Log;

class WhatsAppReceiptService implements NotificationServiceInterface
{
    /**
     * WhatsApp provider wrapper.
     * Can be configured with UltraMsg, WATI, Twilio WhatsApp, or custom API endpoints.
     */
    public function sendReceipt(Donation $donation): bool
    {
        if (empty($donation->donor_mobile)) {
            Log::info("WhatsApp notification skipped: No donor mobile for receipt #{$donation->receipt_number}");
            return false;
        }

        $message = "🚩 *Shree Ganesha Seva Trust*\n"
            . "Donation Receipt: *{$donation->receipt_number}*\n\n"
            . "Dear *{$donation->donor_name}*,\n"
            . "Thank you for your generous donation of *₹" . number_format($donation->amount, 2) . "* ({$donation->amount_in_words}).\n\n"
            . "Payment Method: {$donation->payment_method}\n"
            . "Status: {$donation->payment_status}\n"
            . "Collected By: {$donation->collected_by}\n\n"
            . "Thank you for supporting our Ganpati festival and social initiatives! 🙏";

        // Log WhatsApp dispatch integration point
        Log::info("WhatsApp Notification Dispatched for #{$donation->receipt_number} to {$donation->donor_mobile}:\n{$message}");

        return true;
    }
}
