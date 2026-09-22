<?php

namespace App\Http\Controllers;

use App\Models\Donation;
use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $trustId = (string) $user->trust_id;
        $user->load('trust');

        // Fetch Collections once to reduce remote DB roundtrip latency
        $allDonations = Donation::where('trust_id', $trustId)->get();
        $allExpenses = Expense::where('trust_id', $trustId)->get();

        $totalIncome = (float) $allDonations->where('payment_status', 'Paid')->sum('amount');
        $totalExpenses = (float) $allExpenses->sum('amount');
        $pendingAmount = (float) $allDonations->where('payment_status', 'Pending')->sum('amount');
        $balance = $totalIncome - $totalExpenses;

        // Category breakdown for expenses
        $expensesByCategory = $allExpenses
            ->groupBy('category')
            ->map(function ($items, $category) {
                return [
                    'category' => $category,
                    'total' => $items->sum('amount'),
                    'count' => $items->count(),
                ];
            })->values();

        // Income list with search/filter
        $incomeSearch = $request->input('income_search');
        $incomeQuery = Donation::where('trust_id', $trustId);
        if ($incomeSearch) {
            $incomeQuery->where(function ($q) use ($incomeSearch) {
                $q->where('donor_name', 'LIKE', "%{$incomeSearch}%")
                  ->orWhere('receipt_number', 'LIKE', "%{$incomeSearch}%");
            });
        }
        $incomeList = $incomeQuery->orderBy('created_at', 'desc')->paginate(10, ['*'], 'income_page')->withQueryString();

        // Expense list with search/category filter
        $expenseSearch = $request->input('expense_search');
        $categoryFilter = $request->input('category');
        $expenseQuery = Expense::where('trust_id', $trustId);
        if ($expenseSearch) {
            $expenseQuery->where('title', 'LIKE', "%{$expenseSearch}%");
        }
        if ($categoryFilter && $categoryFilter !== 'All') {
            $expenseQuery->where('category', $categoryFilter);
        }
        $expenseList = $expenseQuery->orderBy('expense_date', 'desc')->paginate(10, ['*'], 'expense_page')->withQueryString();

        return Inertia::render('Reports/Index', [
            'auth' => [
                'user' => $user,
                'trust' => $user->trust,
            ],
            'summary' => [
                'totalIncome' => $totalIncome,
                'totalExpenses' => $totalExpenses,
                'pendingAmount' => $pendingAmount,
                'balance' => $balance,
            ],
            'expensesByCategory' => $expensesByCategory,
            'incomeList' => $incomeList,
            'expenseList' => $expenseList,
            'filters' => [
                'income_search' => $incomeSearch ?? '',
                'expense_search' => $expenseSearch ?? '',
                'category' => $categoryFilter ?? 'All',
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }
}
