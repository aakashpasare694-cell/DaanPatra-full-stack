import React, { useState } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import AppLayout from '@/Layouts/AppLayout';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Lock, 
  Trash2, 
  X, 
  Crown
} from 'lucide-react';

export default function Index({ users }) {
  const { auth } = usePage().props;
  const currentUser = auth?.user;
  const isAdmin = !currentUser?.role || currentUser?.role?.toLowerCase() === 'admin';

  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  const form = useForm({
    name: '',
    email: '',
    mobile: '',
    role: 'normal',
    password: '',
  });

  const handleCreateUser = (e) => {
    e.preventDefault();
    form.post(route('users.store'), {
      onSuccess: () => {
        setIsAddUserOpen(false);
        form.reset();
        toast.success('New trust member added successfully.');
      }
    });
  };

  const handleRoleToggle = (user) => {
    if (!isAdmin) {
      toast.error('Only Trust Admins can modify member roles.');
      return;
    }
    const newRole = user.is_admin ? 'normal' : 'admin';
    router.put(route('users.updateRole', user.id), { role: newRole }, {
      onSuccess: () => toast.success(`Role updated for ${user.name}.`),
    });
  };

  const handleDeleteUser = (userId, userName) => {
    if (!isAdmin) {
      toast.error('Only Trust Admins can remove members.');
      return;
    }
    if (confirm(`Remove '${userName}' from trust members?`)) {
      router.delete(route('users.destroy', userId), {
        onSuccess: () => toast.success('Member removed.'),
      });
    }
  };

  return (
    <AppLayout 
      activeTab="users"
      actionButton={
        isAdmin ? (
          <button
            onClick={() => setIsAddUserOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs md:text-sm shadow-md flex items-center gap-2 transition-all"
          >
            <UserPlus className="w-4 h-4 text-amber-400" />
            <span>Add Member</span>
          </button>
        ) : null
      }
    >
      <div className="space-y-8 pb-10">
        
        {/* SUMMARY STRIP */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#faf4ef] border border-[#eee4dd] p-5 rounded-3xl">
          <div>
            <h2 className="font-heading font-extrabold text-slate-900 text-xl">
              Trust Members & Role Permissions
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Manage team access. Assign Admin (Full Access) or Normal User (Read-Only) roles.
            </p>
          </div>

          <div className="bg-white border border-[#eee4dd] px-4 py-2 rounded-2xl shadow-sm text-right">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Active Members</span>
            <span className="font-heading font-black text-slate-900 text-sm">{users.length} Devotees</span>
          </div>
        </div>

        {/* ROLE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-[#eee4dd] p-4 rounded-2xl flex items-start gap-3 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Admin Role (Full Access)</h4>
              <p className="text-xs text-slate-500 mt-1">
                Full CRUD permissions: Record donations, issue receipts, manage expenses, and update roles.
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#eee4dd] p-4 rounded-2xl flex items-start gap-3 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Normal User Role (Read-Only)</h4>
              <p className="text-xs text-slate-500 mt-1">
                Read-only access: View dashboard analytics, donation ledgers, expense reports, and receipts.
              </p>
            </div>
          </div>
        </div>

        {/* USERS TABLE */}
        <div className="bg-white border border-[#eee4dd] rounded-3xl overflow-hidden shadow-sm space-y-4 p-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#eee4dd]">
            <h3 className="font-heading font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-600" /> Trust Members List
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#eee4dd] text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Member Name</th>
                  <th className="py-3.5 px-4">Email & Mobile</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eee4dd] text-xs font-medium text-slate-700">
                {users && users.length > 0 ? (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-[#faf5f2] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center font-extrabold text-xs">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{u.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="text-xs text-slate-800 font-bold">{u.email}</p>
                        <p className="text-[11px] text-slate-400">{u.mobile}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          u.is_admin
                            ? 'bg-amber-100 text-amber-900 border border-amber-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {u.is_admin ? 'Admin (Full CRUD)' : 'Normal User (Read-Only)'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {isAdmin && currentUser?._id !== u.id ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleRoleToggle(u)}
                              className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl"
                            >
                              Make {u.is_admin ? 'Normal' : 'Admin'}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id, u.name)}
                              className="p-1.5 text-slate-400 hover:text-rose-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 font-bold">Active</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-400">No trust members found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ADD MEMBER MODAL */}
      {isAddUserOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-[#eee4dd] rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#eee4dd]">
              <h3 className="font-heading font-extrabold text-slate-900 text-lg">Add Trust Member</h3>
              <button onClick={() => setIsAddUserOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={form.data.name}
                  onChange={(e) => form.setData('name', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#faf5f2] border border-[#e8ded8] focus:border-amber-500 rounded-xl text-slate-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="rahul@ganpatitrust.org"
                  value={form.data.email}
                  onChange={(e) => form.setData('email', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#faf5f2] border border-[#e8ded8] focus:border-amber-500 rounded-xl text-slate-900 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Role</label>
                  <select
                    value={form.data.role}
                    onChange={(e) => form.setData('role', e.target.value)}
                    className="w-full px-3 py-2 bg-[#faf5f2] border border-[#e8ded8] rounded-xl text-xs text-slate-900 font-bold"
                  >
                    <option value="normal">Normal User (Read-Only)</option>
                    <option value="admin">Trust Admin (Full Access)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={form.data.password}
                    onChange={(e) => form.setData('password', e.target.value)}
                    className="w-full px-3 py-2 bg-[#faf5f2] border border-[#e8ded8] rounded-xl text-xs text-slate-900"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow"
                >
                  Create Member Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </AppLayout>
  );
}
