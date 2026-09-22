import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { 
  History, 
  Search, 
  Layers, 
  ChevronDown
} from 'lucide-react';

export default function Index({ logs, actionTypes, filters, summary }) {
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [selectedAction, setSelectedAction] = useState(filters.action_type || 'All');
  const [expandedLogId, setExpandedLogId] = useState(null);

  const handleFilter = (newSearch, newAction) => {
    router.get(
      route('activity-logs.index'),
      { search: newSearch, action_type: newAction },
      { preserveState: true, replace: true }
    );
  };

  const getActionBadgeClass = (actionType) => {
    if (!actionType) return 'bg-slate-100 text-slate-700';
    if (actionType.includes('CREATED') || actionType.includes('PAID')) {
      return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
    }
    if (actionType.includes('UPDATED')) {
      return 'bg-sky-100 text-sky-800 border border-sky-200';
    }
    if (actionType.includes('DELETED') || actionType.includes('REMOVED')) {
      return 'bg-rose-100 text-rose-800 border border-rose-200';
    }
    return 'bg-amber-100 text-amber-800 border border-amber-200';
  };

  return (
    <AppLayout activeTab="activity-logs">
      <div className="space-y-8 pb-10">
        
        {/* SUMMARY STRIP */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#faf4ef] border border-[#eee4dd] p-5 rounded-3xl">
          <div>
            <h2 className="font-heading font-extrabold text-slate-900 text-xl">
              System Audit Traversal Logs
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Immutable audit history of all trust records, expenses, receipts, and permissions.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white border border-[#eee4dd] px-4 py-2 rounded-2xl shadow-sm">
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Total Events</span>
              <span className="font-heading font-black text-slate-900 text-sm">{summary.totalLogs}</span>
            </div>
            <div className="w-px h-6 bg-[#eee4dd]"></div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Today</span>
              <span className="font-heading font-black text-emerald-600 text-sm">{summary.todayLogs}</span>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#eee4dd] shadow-sm">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search logs description or user..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleFilter(e.target.value, selectedAction);
                }}
                className="w-full pl-9 pr-3 py-2 bg-[#faf5f2] border border-[#e8ded8] focus:border-amber-500 focus:bg-white rounded-xl text-xs text-slate-900 focus:outline-none"
              />
            </div>

            <select
              value={selectedAction}
              onChange={(e) => {
                setSelectedAction(e.target.value);
                handleFilter(searchQuery, e.target.value);
              }}
              className="px-3.5 py-2 bg-[#faf5f2] border border-[#e8ded8] focus:border-amber-500 rounded-xl text-xs text-slate-900 font-bold focus:outline-none min-w-[160px]"
            >
              <option value="All">All Event Types</option>
              <option value="DONATION_CREATED">Donation Created</option>
              <option value="DONATION_UPDATED">Donation Updated</option>
              <option value="DONATION_DELETED">Donation Deleted</option>
              <option value="PAYMENT_MARKED_PAID">Payment Marked Paid</option>
              <option value="EXPENSE_CREATED">Expense Created</option>
              <option value="EXPENSE_UPDATED">Expense Updated</option>
              <option value="EXPENSE_DELETED">Expense Deleted</option>
              <option value="USER_CREATED">User Created</option>
              <option value="USER_ROLE_UPDATED">User Role Updated</option>
              <option value="USER_REMOVED">User Removed</option>
            </select>
          </div>
        </div>

        {/* LOGS TABLE */}
        <div className="bg-white border border-[#eee4dd] rounded-3xl overflow-hidden shadow-sm space-y-4 p-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#eee4dd]">
            <h3 className="font-heading font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-600" /> Audit Trail Stream
            </h3>
            <span className="text-xs text-slate-500 font-medium">Page {logs.current_page} of {logs.last_page}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#eee4dd] text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4">Action Event</th>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4">IP</th>
                  <th className="py-3.5 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eee4dd] text-xs font-medium text-slate-700">
                {logs.data && logs.data.length > 0 ? (
                  logs.data.map((log) => (
                    <React.Fragment key={log._id}>
                      <tr className="hover:bg-[#faf5f2] transition-colors">
                        
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <p className="font-bold text-slate-900">
                            {log.created_at ? new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {log.created_at ? new Date(log.created_at).toLocaleDateString() : ''}
                          </p>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${getActionBadgeClass(log.action_type)}`}>
                            {log.action_type}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-bold text-slate-900">{log.user_name}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <p className="text-xs text-slate-800">{log.description}</p>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-slate-500">
                          {log.ip_address || '127.0.0.1'}
                        </td>

                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          {log.details && Object.keys(log.details).length > 0 && (
                            <button
                              onClick={() => setExpandedLogId(expandedLogId === log._id ? null : log._id)}
                              className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg flex items-center gap-1 ml-auto font-bold"
                            >
                              <span>Payload</span>
                              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedLogId === log._id ? 'rotate-180' : ''}`} />
                            </button>
                          )}
                        </td>
                      </tr>

                      {expandedLogId === log._id && log.details && (
                        <tr className="bg-[#faf5f2]">
                          <td colSpan="6" className="p-4 border-b border-[#eee4dd]">
                            <div className="bg-white border border-[#eee4dd] rounded-xl p-3 font-mono text-xs text-slate-800 overflow-x-auto">
                              <pre>{JSON.stringify(log.details, null, 2)}</pre>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400">
                      No system activity logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </AppLayout>
  );
}
