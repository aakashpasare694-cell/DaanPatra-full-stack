<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ExpenseController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'amount' => 'required|numeric|min:1',
            'category' => 'required|string|in:Decoration,Sound System,Food,Prasad,Electricity,Transport,Cleaning,Donation / Social Work,Other',
            'expense_date' => 'required|date',
            'paid_by' => 'required|string|max:255',
            'payment_method' => 'required|string|in:Cash,Online,QR Code,Cheque',
            'notes' => 'nullable|string',
        ]);

        $trustId = (string) Auth::user()->trust_id;

        Expense::create(array_merge($validated, ['trust_id' => $trustId]));

        return back()->with('success', 'Expense recorded successfully.');
    }

    public function update(Request $request, $id)
    {
        $trustId = (string) Auth::user()->trust_id;
        $expense = Expense::where('trust_id', $trustId)->where('_id', $id)->firstOrFail();

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'amount' => 'required|numeric|min:1',
            'category' => 'required|string|in:Decoration,Sound System,Food,Prasad,Electricity,Transport,Cleaning,Donation / Social Work,Other',
            'expense_date' => 'required|date',
            'paid_by' => 'required|string|max:255',
            'payment_method' => 'required|string|in:Cash,Online,QR Code,Cheque',
            'notes' => 'nullable|string',
        ]);

        $expense->update($validated);

        return back()->with('success', 'Expense updated successfully.');
    }

    public function destroy($id)
    {
        $trustId = (string) Auth::user()->trust_id;
        $expense = Expense::where('trust_id', $trustId)->where('_id', $id)->firstOrFail();
        $expense->delete();

        return back()->with('success', 'Expense deleted successfully.');
    }
}
