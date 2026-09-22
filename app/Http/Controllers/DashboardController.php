<?php

namespace App\Http\Controllers;

use App\Models\Donation;
use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $trustId = (string) $user->trust_id;
        $user->load('trust');

        // Core Summary Metrics
        $totalPledged = (float) Donation::where('trust_id', $trustId)->sum('amount');
        
        $collectedAmount = (float) Donation::where('trust_id', $trustId)
            ->where('payment_status', 'Paid')
            ->sum('amount');

        $pendingAmount = (float) Donation::where('trust_id', $trustId)
            ->where('payment_status', 'Pending')
            ->sum('amount');

        $totalExpenses = (float) Expense::where('trust_id', $trustId)->sum('amount');
        $donorCount = Donation::where('trust_id', $trustId)->count();
        $netBalance = $collectedAmount - $totalExpenses;

        // Payment Method Breakdown for Charts
        $allDonations = Donation::where('trust_id', $trustId)->get();
        
        $methodsMap = [
            'Cash' => ['name' => 'Cash', 'value' => 0, 'count' => 0, 'color' => '#f59e0b'],
            'Online' => ['name' => 'Online NetBanking', 'value' => 0, 'count' => 0, 'color' => '#3b82f6'],
            'QR Code' => ['name' => 'UPI / QR Code', 'value' => 0, 'count' => 0, 'color' => '#10b981'],
            'Cheque' => ['name' => 'Bank Cheque', 'value' => 0, 'count' => 0, 'color' => '#8b5cf6'],
        ];

        foreach ($allDonations as $d) {
            $method = $d->payment_method ?? 'Cash';
            if (!isset($methodsMap[$method])) {
                $methodsMap[$method] = ['name' => $method, 'value' => 0, 'count' => 0, 'color' => '#06b6d4'];
            }
            $methodsMap[$method]['value'] += (float) $d->amount;
            $methodsMap[$method]['count'] += 1;
        }
        $paymentMethodsData = array_values($methodsMap);

        // Daily / Date-wise Collection Trends (Last 7 days or all dates)
        $trendData = $allDonations
            ->groupBy(function ($d) {
                return $d->donation_date ? substr((string)$d->donation_date, 0, 10) : date('Y-m-d');
            })
            ->map(function ($items, $date) {
                $paid = $items->where('payment_status', 'Paid')->sum('amount');
                $pending = $items->where('payment_status', 'Pending')->sum('amount');
                return [
                    'date' => date('d M', strtotime($date)),
                    'full_date' => $date,
                    'Paid' => (float) $paid,
                    'Pending' => (float) $pending,
                    'Total' => (float) ($paid + $pending),
                ];
            })
            ->sortBy('full_date')
            ->values();

        // Payment Status Breakdown Diagram Data
        $statusBreakdown = [
            ['name' => 'Paid & Collected', 'amount' => $collectedAmount, 'count' => $allDonations->where('payment_status', 'Paid')->count(), 'fill' => '#10b981'],
            ['name' => 'Pending Follow-ups', 'amount' => $pendingAmount, 'count' => $allDonations->where('payment_status', 'Pending')->count(), 'fill' => '#f59e0b'],
        ];

        // Expenses Category Breakdown
        $expenses = Expense::where('trust_id', $trustId)->get();
        $expensesByCategory = $expenses
            ->groupBy('category')
            ->map(function ($items, $category) {
                return [
                    'category' => $category,
                    'amount' => (float) $items->sum('amount'),
                    'count' => $items->count(),
                ];
            })
            ->values();

        // Top 5 Donors Leaderboard
        $topDonors = $allDonations
            ->sortByDesc('amount')
            ->take(5)
            ->map(function ($d) {
                return [
                    'id' => (string)$d->_id,
                    'receipt_number' => $d->receipt_number,
                    'donor_name' => $d->donor_name,
                    'donor_mobile' => $d->donor_mobile,
                    'amount' => (float)$d->amount,
                    'payment_method' => $d->payment_method,
                    'payment_status' => $d->payment_status,
                    'created_at' => $d->created_at ? $d->created_at->format('d M, h:i A') : '',
                ];
            })
            ->values();

        // Recent Activity Feed (Latest 6 donations)
        $recentDonations = Donation::where('trust_id', $trustId)
            ->orderBy('created_at', 'desc')
            ->take(6)
            ->get()
            ->map(function ($d) {
                return [
                    'id' => (string)$d->_id,
                    'type' => 'donation',
                    'user' => $d->donor_name,
                    'action' => "Donated " . (new \NumberFormatter('en_IN', \NumberFormatter::CURRENCY))->formatCurrency((float)$d->amount, 'INR') . " via {$d->payment_method}",
                    'time' => $d->created_at ? $d->created_at->format('H:i') : '10:00',
                    'title' => "Donation from {$d->donor_name}",
                    'subtitle' => "Receipt #{$d->receipt_number} • {$d->payment_method}",
                    'amount' => (float)$d->amount,
                    'status' => $d->payment_status,
                    'date' => $d->created_at ? $d->created_at->diffForHumans() : 'Recently',
                ];
            });

        return Inertia::render('Dashboard/Index', [
            'auth' => [
                'user' => $user,
                'trust' => $user->trust,
            ],
            'metrics' => [
                'totalPledged' => $totalPledged,
                'collectedAmount' => $collectedAmount,
                'pendingAmount' => $pendingAmount,
                'totalExpenses' => $totalExpenses,
                'netBalance' => $netBalance,
                'donorCount' => $donorCount,
            ],
            'charts' => [
                'paymentMethods' => $paymentMethodsData,
                'trends' => $trendData,
                'statusBreakdown' => $statusBreakdown,
                'expensesByCategory' => $expensesByCategory,
            ],
            'topDonors' => $topDonors,
            'recentActivity' => $recentDonations,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }
}
