import React, { useState } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import AppLayout from '@/Layouts/AppLayout';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Plus, 
  FileText, 
  Search, 
  Trash2, 
  X, 
  Sparkles,
  CheckCircle2,
  Clock,
  Edit2,
  User,
  Phone,
  IndianRupee,
  Calendar,
  Layers,
  Tag
} from 'lucide-react';

export default function Reports({ summary = {}, incomeList = {}, expenseList = {}, filters = {} }) {
  const { auth } = usePage().props;
  const userName = auth?.user?.name || 'Trust Member';
  const isAdmin = !auth?.user?.role || auth?.user?.role?.toLowerCase() === 'admin';

  const [activeTab, setActiveTab] = useState('income');
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  // Extract arrays safely whether paginated or raw array
  const incomeData = Array.isArray(incomeList) ? incomeList : (incomeList?.data || []);
  const expenseData = Array.isArray(expenseList) ? expenseList : (expenseList?.data || []);

  const incomeForm = useForm({
    donor_name: '',
    donor_mobile: '',
    donor_email: '',
    income_type: 'Donation / Vargani',
    amount: '',
    amount_in_words: '',
    payment_method: 'Cash',
    payment_status: 'Paid',
    collected_by: userName,
  });

  const expenseForm = useForm({
    title: '',
    description: '',
    amount: '',
    category: 'Decoration',
    expense_date: new Date().toISOString().split('T')[0],
    paid_by: userName,
    payment_method: 'Online',
    notes: '',
  });

  const handleIncomeSubmit = (e) => {
    e.preventDefault();
    incomeForm.post(route('donations.store'), {
      onSuccess: () => {
        setIsAddIncomeOpen(false);
        incomeForm.reset();
        toast.success('Income record added successfully.');
      }
    });
  };

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    if (editingExpense) {
      expenseForm.put(route('expenses.update', editingExpense._id), {
        onSuccess: () => {
          setIsAddExpenseOpen(false);
          setEditingExpense(null);
          expenseForm.reset();
          toast.success('Expense record updated.');
        }
      });
    } else {
      expenseForm.post(route('expenses.store'), {
        onSuccess: () => {
          setIsAddExpenseOpen(false);
          expenseForm.reset();
          toast.success('Expense recorded successfully.');
        }
      });
    }
  };

  const handleEditExpense = (exp) => {
    setEditingExpense(exp);
    expenseForm.setData({
      title: exp.title,
      description: exp.description || '',
      amount: exp.amount,
      category: exp.category,
      expense_date: exp.expense_date ? exp.expense_date.substring(0, 10) : new Date().toISOString().split('T')[0],
      paid_by: exp.paid_by,
      payment_method: exp.payment_method,
      notes: exp.notes || '',
    });
    setIsAddExpenseOpen(true);
  };

  const handleDeleteExpense = (id) => {
    if (confirm('Delete this expense record?')) {
      router.delete(route('expenses.destroy', id), {
        onSuccess: () => toast.success('Expense deleted.'),
      });
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const incomeCategories = [
    'Donation / Vargani',
    'Banner / Flex Advertisement',
    'Stall / Food Vendor Setup Fee',
    'Sponsorship (Gold / Silver / Bronze)',
    'Cultural Program Ticket / Pass',
    'Chief Guest / VVIP Contribution',
    'Government / Municipal Grant',
    'Other Festival Income'
  ];

  const expenseCategories = [
    'Decoration',
    'Prasad & Bhog',
    'Sound & DJ System',
    'Security & CCTV',
    'Lighting & Mandap',
    'Cleaning & Waste',
    'Printing & Receipts',
    'Miscellaneous'
  ];

  return (
    <AppLayout 
      activeTab="reports"
      actionButton={
        activeTab === 'income' ? (
          <button
            onClick={() => setIsAddIncomeOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs md:text-sm shadow-md flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Income</span>
          </button>
        ) : (
          <button
            onClick={() => { setEditingExpense(null); expenseForm.reset(); setIsAddExpenseOpen(true); }}
            className="px-5 py-2.5 rounded-xl bg-[#ff6b57] hover:bg-rose-600 text-white font-bold text-xs md:text-sm shadow-md flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        )
      }
    >
      <div className="space-y-8 pb-10">
        
        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-[#eee4dd] rounded-3xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Income</span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="font-heading text-2xl md:text-3xl font-black text-emerald-600">
              {formatCurrency(summary.totalIncome)}
            </div>
          </div>

          <div className="bg-white border border-[#eee4dd] rounded-3xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Expense</span>
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center">
                <TrendingDown className="w-5 h-5" />
              </div>
            </div>
            <div className="font-heading text-2xl md:text-3xl font-black text-rose-600">
              {formatCurrency(summary.totalExpenses)}
            </div>
          </div>

          <div className="bg-white border border-[#eee4dd] rounded-3xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Net Balance</span>
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <div className="font-heading text-2xl md:text-3xl font-black text-slate-900">
              {formatCurrency(summary.balance)}
            </div>
          </div>
        </div>

        {/* TAB SWITCHER */}
        <div className="flex items-center gap-3 bg-[#faf4ef] border border-[#eee4dd] p-2 rounded-2xl">
          <button
            onClick={() => setActiveTab('income')}
            className={`flex-1 py-2.5 rounded-xl font-extrabold text-sm transition-all flex items-center justify-center gap-2 ${
              activeTab === 'income'
                ? 'bg-slate-900 text-white shadow'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Income Ledger ({incomeData.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('expense')}
            className={`flex-1 py-2.5 rounded-xl font-extrabold text-sm transition-all flex items-center justify-center gap-2 ${
              activeTab === 'expense'
                ? 'bg-slate-900 text-white shadow'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingDown className="w-4 h-4 text-rose-400" />
            <span>Expense Ledger ({expenseData.length})</span>
          </button>
        </div>

        {/* CONTENT LEDGER TABLE */}
        <div className="bg-white border border-[#eee4dd] rounded-3xl p-6 shadow-sm">
          {activeTab === 'income' ? (
            <div className="space-y-4">
              <h3 className="font-heading font-extrabold text-slate-900 text-base">
                Income Records & Sources
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#eee4dd] text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-4">Receipt / Ref</th>
                      <th className="py-3 px-4">Source / Payer</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Method</th>
                      <th className="py-3 px-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eee4dd] text-xs font-medium text-slate-700">
                    {incomeData.map((inc) => (
                      <tr key={inc._id} className="hover:bg-[#faf5f2]">
                        <td className="py-3 px-4 font-bold text-slate-900">{inc.receipt_number || 'INC-REF'}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{inc.donor_name}</td>
                        <td className="py-3 px-4 text-slate-600">{inc.category || 'Festival Donation'}</td>
                        <td className="py-3 px-4">{inc.payment_method}</td>
                        <td className="py-3 px-4 text-right font-black text-emerald-600">{formatCurrency(inc.amount)}</td>
                      </tr>
                    ))}
                    {incomeData.length === 0 && (
                      <tr>
                        <td colSpan="5" className="py-6 text-center text-slate-400">No income records available.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-heading font-extrabold text-slate-900 text-base">
                Expense Statements
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#eee4dd] text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-4">Title</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Paid By</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 text-right">Amount</th>
                      {isAdmin && <th className="py-3 px-4 text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eee4dd] text-xs font-medium text-slate-700">
                    {expenseData.map((exp) => (
                      <tr key={exp._id} className="hover:bg-[#faf5f2]">
                        <td className="py-3 px-4 font-bold text-slate-900">{exp.title}</td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            {exp.category}
                          </span>
                        </td>
                        <td className="py-3 px-4">{exp.paid_by}</td>
                        <td className="py-3 px-4 text-slate-500">{exp.expense_date ? exp.expense_date.substring(0, 10) : ''}</td>
                        <td className="py-3 px-4 text-right font-black text-rose-600">{formatCurrency(exp.amount)}</td>
                        {isAdmin && (
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => handleEditExpense(exp)} className="p-1 text-slate-600 hover:text-sky-600">
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => handleDeleteExpense(exp._id)} className="p-1 text-slate-400 hover:text-rose-600">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                    {expenseData.length === 0 && (
                      <tr>
                        <td colSpan="6" className="py-6 text-center text-slate-400">No expense records logged.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ADD INCOME MODAL */}
      {isAddIncomeOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-[#eee4dd] rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#eee4dd]">
              <h3 className="font-heading font-extrabold text-slate-900 text-lg">Add Income Source</h3>
              <button onClick={() => setIsAddIncomeOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleIncomeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Source / Payer Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Local Shop Ads / Vendor"
                  value={incomeForm.data.donor_name}
                  onChange={(e) => incomeForm.setData('donor_name', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#faf5f2] border border-[#e8ded8] focus:border-amber-500 rounded-xl text-slate-900 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Type</label>
                  <select
                    value={incomeForm.data.income_type}
                    onChange={(e) => incomeForm.setData('income_type', e.target.value)}
                    className="w-full px-3 py-2 bg-[#faf5f2] border border-[#e8ded8] rounded-xl text-xs text-slate-900 font-medium"
                  >
                    {incomeCategories.map((cat, i) => (
                      <option key={i} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="1000"
                    value={incomeForm.data.amount}
                    onChange={(e) => incomeForm.setData('amount', e.target.value)}
                    className="w-full px-3 py-2 bg-[#faf5f2] border border-[#e8ded8] rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddIncomeOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow"
                >
                  Save Income
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT EXPENSE MODAL */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-[#eee4dd] rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#eee4dd]">
              <h3 className="font-heading font-extrabold text-slate-900 text-lg">
                {editingExpense ? 'Edit Expense' : 'Log Expense'}
              </h3>
              <button onClick={() => setIsAddExpenseOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleExpenseSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Expense Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mandap Light Setup"
                  value={expenseForm.data.title}
                  onChange={(e) => expenseForm.setData('title', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#faf5f2] border border-[#e8ded8] focus:border-amber-500 rounded-xl text-slate-900 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={expenseForm.data.category}
                    onChange={(e) => expenseForm.setData('category', e.target.value)}
                    className="w-full px-3 py-2 bg-[#faf5f2] border border-[#e8ded8] rounded-xl text-xs text-slate-900 font-medium"
                  >
                    {expenseCategories.map((cat, i) => (
                      <option key={i} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="2500"
                    value={expenseForm.data.amount}
                    onChange={(e) => expenseForm.setData('amount', e.target.value)}
                    className="w-full px-3 py-2 bg-[#faf5f2] border border-[#e8ded8] rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </AppLayout>
  );
}
