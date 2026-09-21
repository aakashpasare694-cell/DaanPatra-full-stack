import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import AppLayout from '@/Layouts/AppLayout';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Plus, 
  FileText, 
  Search, 
  Filter, 
  Trash2, 
  X, 
  Sparkles,
  PieChart as PieIcon,
  CheckCircle2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell 
} from 'recharts';

export default function Reports({ summary, expensesByCategory, incomeList, expenseList, filters }) {
  const [activeTab, setActiveTab] = useState('income'); // 'income' or 'expense'
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const { data, setData, post, put, processing, reset, errors } = useForm({
    title: '',
    description: '',
    amount: '',
    category: 'Decoration',
    expense_date: new Date().toISOString().split('T')[0],
    paid_by: 'Rajesh Sharma',
    payment_method: 'Online',
    notes: '',
  });

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    if (editingExpense) {
      put(route('expenses.update', editingExpense._id), {
        onSuccess: () => {
          setIsAddExpenseOpen(false);
          setEditingExpense(null);
          reset();
          toast.success('Expense updated.');
        }
      });
    } else {
      post(route('expenses.store'), {
        onSuccess: () => {
          setIsAddExpenseOpen(false);
          reset();
          toast.success('Expense recorded successfully.');
        }
      });
    }
  };

  const handleEditExpense = (exp) => {
    setEditingExpense(exp);
    setData({
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

  // Prepare chart data
  const chartData = [
    { name: 'Total Income', amount: summary.totalIncome, fill: '#10b981' },
    { name: 'Total Expense', amount: summary.totalExpenses, fill: '#f43f5e' },
    { name: 'Pending Amount', amount: summary.pendingAmount, fill: '#f59e0b' },
    { name: 'Net Balance', amount: Math.max(0, summary.balance), fill: '#f97316' },
  ];

  return (
    <AppLayout activeTab="reports">
      <div className="space-y-8">
        
        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-saffron-400 font-semibold text-xs tracking-wider uppercase mb-1">
              <BarChart3 className="w-3.5 h-3.5" /> Financial Overview & Audit
            </div>
            <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
              Reports & Expenses
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Centralized financial statements, category expense management, and income vs expense balances.
            </p>
          </div>
          <button
            onClick={() => { setEditingExpense(null); reset(); setIsAddExpenseOpen(true); }}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-saffron-600 to-saffron-500 hover:from-saffron-500 hover:to-saffron-400 text-white font-bold text-sm rounded-xl shadow-lg shadow-saffron-600/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Expense</span>
          </button>
        </div>

        {/* 1. TOP FINANCIAL SUMMARY WIDGETS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Widget 1: Total Income */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 glass-card"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Income</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="font-heading text-2xl md:text-3xl font-extrabold text-emerald-400">
              {formatCurrency(summary.totalIncome)}
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Collected donations</p>
          </motion.div>

          {/* Widget 2: Total Expense */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 glass-card"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Expense</span>
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                <TrendingDown className="w-5 h-5" />
              </div>
            </div>
            <div className="font-heading text-2xl md:text-3xl font-extrabold text-rose-400">
              {formatCurrency(summary.totalExpenses)}
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Festival operating costs</p>
          </motion.div>

          {/* Widget 3: Pending Amount */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 glass-card"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Amount</span>
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="font-heading text-2xl md:text-3xl font-extrabold text-amber-400">
              {formatCurrency(summary.pendingAmount)}
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Pledged donations</p>
          </motion.div>

          {/* Widget 4: Net Balance */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-gradient-to-br from-slate-900 via-slate-900 to-saffron-950/30 border border-saffron-500/30 rounded-2xl p-5 glass-card"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-saffron-300 uppercase tracking-wider">Net Balance</span>
              <div className="w-9 h-9 rounded-xl bg-saffron-500/20 text-saffron-400 flex items-center justify-center font-bold">
                ₹
              </div>
            </div>
            <div className="font-heading text-2xl md:text-3xl font-extrabold text-saffron-400">
              {formatCurrency(summary.balance)}
            </div>
            <p className="text-[11px] text-slate-300 mt-2">Income minus expenses</p>
          </motion.div>

        </div>

        {/* 2. INCOME VS EXPENSE VISUALIZATION CHART */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart Card */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 glass-panel space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-heading font-bold text-base text-slate-100 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-saffron-400" />
                <span>Financial Comparison Chart</span>
              </h3>
              <span className="text-xs text-slate-400 font-medium">Ganpati Utsav 2026</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickFormatter={(val) => `₹${val / 1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                    formatter={(val) => [formatCurrency(val), 'Amount']}
                  />
                  <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Expense Breakdown */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 glass-panel space-y-4">
            <h3 className="font-heading font-bold text-base text-slate-100 border-b border-slate-800 pb-3 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-saffron-400" />
              <span>Expense Categories</span>
            </h3>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {expensesByCategory?.length > 0 ? (
                expensesByCategory.map((cat, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 text-xs">
                    <div>
                      <span className="font-semibold text-slate-200 block">{cat.category}</span>
                      <span className="text-[10px] text-slate-400">{cat.count} transactions</span>
                    </div>
                    <span className="font-bold text-slate-100">{formatCurrency(cat.total)}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 text-center py-6">No expenses logged yet.</p>
              )}
            </div>
          </div>

        </div>

        {/* 3. INCOME / EXPENSE TABBED TABLES */}
        <div className="space-y-4">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-2xl border border-slate-800">
              <button
                onClick={() => setActiveTab('income')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'income'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Income Statements ({incomeList?.total || 0})
              </button>
              <button
                onClick={() => setActiveTab('expense')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'expense'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Expense Records ({expenseList?.total || 0})
              </button>
            </div>
          </div>

          {/* TAB 1: INCOME STATEMENT TABLE */}
          {activeTab === 'income' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden glass-panel">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/60 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Receipt No.</th>
                    <th className="py-3.5 px-4">Donor Name</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Method</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Collected By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs font-medium text-slate-200">
                  {incomeList?.data?.length > 0 ? (
                    incomeList.data.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4 text-slate-400">
                          {item.donation_date ? new Date(item.donation_date).toLocaleDateString('en-IN') : '-'}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-saffron-400">
                          {item.receipt_number}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-100">
                          {item.donor_name}
                        </td>
                        <td className="py-3 px-4 font-bold text-emerald-400">
                          {formatCurrency(item.amount)}
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          {item.payment_method}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            item.payment_status === 'Paid'
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : 'bg-amber-500/15 text-amber-400'
                          }`}>
                            {item.payment_status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400">
                          {item.collected_by}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-slate-500">
                        No income records logged.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: EXPENSE STATEMENT TABLE */}
          {activeTab === 'expense' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden glass-panel">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/60 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Expense Title</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Paid By</th>
                    <th className="py-3.5 px-4">Method</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs font-medium text-slate-200">
                  {expenseList?.data?.length > 0 ? (
                    expenseList.data.map((exp) => (
                      <tr key={exp._id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4 text-slate-400">
                          {exp.expense_date ? new Date(exp.expense_date).toLocaleDateString('en-IN') : '-'}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-100">
                          <div>{exp.title}</div>
                          {exp.description && <div className="text-[11px] text-slate-400 font-normal">{exp.description}</div>}
                        </td>
                        <td className="py-3 px-4 text-saffron-300">
                          <span className="bg-saffron-500/10 px-2 py-0.5 rounded-md border border-saffron-500/20 text-[11px]">
                            {exp.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-rose-400">
                          {formatCurrency(exp.amount)}
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          {exp.paid_by}
                        </td>
                        <td className="py-3 px-4 text-slate-400">
                          {exp.payment_method}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleEditExpense(exp)}
                              className="p-1.5 text-slate-300 hover:text-sky-400 hover:bg-slate-800 rounded-lg"
                              title="Edit Expense"
                            >
                              ✎
                            </button>
                            <button
                              onClick={() => handleDeleteExpense(exp._id)}
                              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-slate-500">
                        No expenses logged. Click "Add New Expense" above to record one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </div>

      {/* ADD / EDIT EXPENSE MODAL */}
      <AnimatePresence>
        {isAddExpenseOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl glass-panel relative"
            >
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
                <h3 className="font-heading font-bold text-lg text-slate-100">
                  {editingExpense ? 'Edit Expense Record' : 'Record Festival Expense'}
                </h3>
                <button
                  onClick={() => setIsAddExpenseOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleExpenseSubmit} className="space-y-4">
                
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Expense Title <span className="text-saffron-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    placeholder="e.g. Mandap & Flower Decoration"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-saffron-500"
                    required
                  />
                  {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Amount (₹) <span className="text-saffron-400">*</span>
                    </label>
                    <input
                      type="number"
                      value={data.amount}
                      onChange={(e) => setData('amount', e.target.value)}
                      placeholder="15000"
                      min="1"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-100 outline-none focus:border-saffron-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Category <span className="text-saffron-400">*</span>
                    </label>
                    <select
                      value={data.category}
                      onChange={(e) => setData('category', e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-saffron-500"
                    >
                      <option value="Decoration">Decoration</option>
                      <option value="Sound System">Sound System</option>
                      <option value="Food">Food</option>
                      <option value="Prasad">Prasad</option>
                      <option value="Electricity">Electricity</option>
                      <option value="Transport">Transport</option>
                      <option value="Cleaning">Cleaning</option>
                      <option value="Donation / Social Work">Donation / Social Work</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Expense Date
                    </label>
                    <input
                      type="date"
                      value={data.expense_date}
                      onChange={(e) => setData('expense_date', e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-saffron-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Payment Method
                    </label>
                    <select
                      value={data.payment_method}
                      onChange={(e) => setData('payment_method', e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-saffron-500"
                    >
                      <option value="Cash">Cash</option>
                      <option value="Online">Online / UPI</option>
                      <option value="QR Code">QR Code</option>
                      <option value="Cheque">Cheque</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Paid By (Trust Representative)
                  </label>
                  <input
                    type="text"
                    value={data.paid_by}
                    onChange={(e) => setData('paid_by', e.target.value)}
                    placeholder="e.g. Rajesh Sharma"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-saffron-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Description / Notes
                  </label>
                  <textarea
                    rows="2"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="Add vendor or invoice notes..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 outline-none focus:border-saffron-500"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="submit"
                    disabled={processing}
                    className="flex-1 py-3 bg-saffron-600 hover:bg-saffron-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-saffron-600/25"
                  >
                    {editingDonation ? 'Update Expense' : 'Save Expense Record'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddExpenseOpen(false)}
                    className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm rounded-xl"
                  >
                    Cancel
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </AppLayout>
  );
}
