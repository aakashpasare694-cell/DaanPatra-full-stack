<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ExpenseController extends Controller
{
    public function store(Request $request)
    {
        $user = Auth::user();
        if ($user->isNormal()) {
            return back()->with('error', 'Access Denied: Read-only members cannot create expense records.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'amount' => 'required|numeric|min:1',
            'category' => 'required|string',
            'expense_date' => 'required|date',
            'paid_by' => 'required|string|max:255',
            'payment_method' => 'required|string|in:Cash,Online,QR Code,Cheque',
            'notes' => 'nullable|string',
        ]);

        $trustId = (string) $user->trust_id;

        $expense = Expense::create(array_merge($validated, ['trust_id' => $trustId]));

        ActivityLogger::log(
            'EXPENSE_CREATED',
            "Recorded festival expense of ₹{$expense->amount} for '{$expense->title}' ({$expense->category})",
            ['title' => $expense->title, 'amount' => $expense->amount, 'category' => $expense->category]
        );

        return back()->with('success', 'Expense recorded successfully.');
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();
        if ($user->isNormal()) {
            return back()->with('error', 'Access Denied: Read-only members cannot update expense records.');
        }

        $trustId = (string) $user->trust_id;
        $expense = Expense::where('trust_id', $trustId)->where('_id', $id)->firstOrFail();

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'amount' => 'required|numeric|min:1',
            'category' => 'required|string',
            'expense_date' => 'required|date',
            'paid_by' => 'required|string|max:255',
            'payment_method' => 'required|string|in:Cash,Online,QR Code,Cheque',
            'notes' => 'nullable|string',
        ]);

        $expense->update($validated);

        ActivityLogger::log(
            'EXPENSE_UPDATED',
            "Updated expense details for '{$expense->title}'",
            ['title' => $expense->title, 'amount' => $expense->amount]
        );

        return back()->with('success', 'Expense updated successfully.');
    }

    public function destroy($id)
    {
        $user = Auth::user();
        if ($user->isNormal()) {
            return back()->with('error', 'Access Denied: Read-only members cannot delete expense records.');
        }

        $trustId = (string) $user->trust_id;
        $expense = Expense::where('trust_id', $trustId)->where('_id', $id)->firstOrFail();
        $title = $expense->title;
        $amount = $expense->amount;

        $expense->delete();

        ActivityLogger::log(
            'EXPENSE_DELETED',
            "Deleted expense record '{$title}' (₹{$amount})",
            ['title' => $title, 'amount' => $amount]
        );

        return back()->with('success', 'Expense deleted successfully.');
    }
}
