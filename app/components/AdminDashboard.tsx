'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useAuth } from '@/app/contexts/AuthContext';
import Link from 'next/link';

type UserData = {
  userId: string;
  classYear: number | null;
  yearTotal: number;
  cumulativeTotal: number;
  entriesCount: number;
  updatedAt: any;
};

type PointEntry = {
  id: string;
  userId: string;
  activityId: string;
  activityName: string;
  date: any;
  schoolYear: number;
  points: number;
  hours?: number;
  notes?: string;
};

function classYearRequiredPoints(classYear?: number | null): number {
  if (!classYear) return 500;
  if (classYear === 2026) return 125;
  if (classYear === 2027) return 250;
  if (classYear === 2028) return 375;
  return 500;
}

export default function AdminDashboard() {
  const { isAuthenticated, user, signIn, signOut, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [verifyingPassword, setVerifyingPassword] = useState(false);
  
  const [users, setUsers] = useState<UserData[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [currentSchoolYear, setCurrentSchoolYear] = useState(2026);
  
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [userEntries, setUserEntries] = useState<PointEntry[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(false);

  const handlePasswordSubmit = async () => {
    if (!password) {
      setPasswordError('Please enter the admin password');
      return;
    }

    setVerifyingPassword(true);
    setPasswordError('');

    try {
      const res = await fetch('/api/admin/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.isAdmin) {
        setIsAdmin(true);
        setPassword('');
        loadUsers();
      } else {
        setPasswordError('Incorrect password');
      }
    } catch (error) {
      setPasswordError('Error verifying password');
    } finally {
      setVerifyingPassword(false);
    }
  };

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data.users || []);
      setCurrentSchoolYear(data.currentSchoolYear || 2026);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadUserEntries = async (userId: string) => {
    setLoadingEntries(true);
    setSelectedUser(userId);
    try {
      const res = await fetch(`/api/admin/points?userId=${encodeURIComponent(userId)}`);
      const data = await res.json();
      setUserEntries(data.entries || []);
    } catch (error) {
      console.error('Error loading user entries:', error);
    } finally {
      setLoadingEntries(false);
    }
  };

  const deleteEntry = async (entryId: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    try {
      await fetch(`/api/admin/points?entryId=${encodeURIComponent(entryId)}`, {
        method: 'DELETE',
      });
      
      if (selectedUser) {
        loadUserEntries(selectedUser);
        loadUsers();
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 text-sm text-[#00205B]/70">Loading...</div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-white/70 backdrop-blur-md border border-[#003DA5]/15 p-8 text-center">
          <Icon icon="mdi:shield-account" className="h-16 w-16 mx-auto text-[#003DA5] mb-4" />
          <h1 className="text-2xl text-[#00205B] font-medium">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-[#00205B]/80">Sign in to access the admin panel.</p>
          <Link href="/login">
            <button className="mt-4 text-sm px-4 py-2 rounded-md bg-[#003DA5] text-white hover:bg-[#00308A]">Sign In</button>
          </Link>
        </motion.div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-white/70 backdrop-blur-md border border-[#003DA5]/15 p-8 max-w-md mx-auto">
          <div className="text-center mb-6">
            <Icon icon="mdi:lock" className="h-12 w-12 mx-auto text-[#003DA5] mb-3" />
            <h1 className="text-2xl text-[#00205B] font-medium">Admin Access</h1>
            <p className="mt-2 text-sm text-[#00205B]/80">Enter the admin password to continue</p>
          </div>
          
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
              placeholder="Admin password"
              className="w-full text-sm px-4 py-2.5 rounded-md border border-[#003DA5]/20 bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#003DA5]/30"
            />
            {passwordError && (
              <p className="text-sm text-red-600">{passwordError}</p>
            )}
            <button
              onClick={handlePasswordSubmit}
              disabled={verifyingPassword}
              className="w-full text-sm px-4 py-2 rounded-md bg-[#003DA5] text-white hover:bg-[#00308A] disabled:opacity-50 transition-colors"
            >
              {verifyingPassword ? 'Verifying...' : 'Access Admin Dashboard'}
            </button>
            <button
              onClick={signOut}
              className="w-full text-sm px-4 py-2 rounded-md border border-[#003DA5]/20 text-[#00205B] hover:bg-[#003DA5]/5 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="rounded-2xl bg-white/70 backdrop-blur-md border border-[#003DA5]/15 p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl text-[#00205B] font-medium flex items-center gap-2">
                <Icon icon="mdi:shield-account" className="h-7 w-7" />
                Admin Dashboard
              </h1>
              <p className="text-sm text-[#00205B]/70 mt-1">
                Manage all member points for School Year ending May 1, {currentSchoolYear}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#00205B]/70">{user?.displayName || user?.email}</span>
              <button
                onClick={() => setIsAdmin(false)}
                className="text-sm px-3 py-1.5 rounded-md border border-[#003DA5]/20 text-[#00205B] hover:bg-[#003DA5]/10"
              >
                Lock Admin
              </button>
              <button
                onClick={signOut}
                className="text-sm px-3 py-1.5 rounded-md bg-[#003DA5] text-white hover:bg-[#00308A]"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Users List */}
          <div className="rounded-2xl bg-white/70 backdrop-blur-md border border-[#003DA5]/15 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg text-[#00205B] font-medium">All Members</h2>
              <button
                onClick={loadUsers}
                disabled={loadingUsers}
                className="text-sm px-3 py-1.5 rounded-md bg-[#FFC72C] text-[#00205B] hover:bg-[#E6B220] disabled:opacity-50"
              >
                <Icon icon="mdi:refresh" className="inline h-4 w-4" /> Refresh
              </button>
            </div>

            {loadingUsers ? (
              <div className="text-center py-8 text-sm text-[#00205B]/70">Loading members...</div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-sm text-[#00205B]/70">No members found</div>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                {users
                  .sort((a, b) => b.cumulativeTotal - a.cumulativeTotal)
                  .map((userData) => {
                    const required = classYearRequiredPoints(userData.classYear);
                    const meetsYearlyGoal = userData.yearTotal >= 125;
                    const meetsCumulativeGoal = userData.cumulativeTotal >= required;

                    return (
                      <motion.button
                        key={userData.userId}
                        onClick={() => loadUserEntries(userData.userId)}
                        className={`w-full text-left p-4 rounded-lg border transition-colors ${
                          selectedUser === userData.userId
                            ? 'border-[#003DA5] bg-[#003DA5]/5'
                            : 'border-[#003DA5]/15 bg-white/60 hover:bg-[#003DA5]/5'
                        }`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-[#00205B] mb-1">
                              User ID: {userData.userId.substring(0, 8)}...
                            </div>
                            <div className="flex items-center gap-3 text-xs text-[#00205B]/70">
                              <span>Class of {userData.classYear || '____'}</span>
                              <span>•</span>
                              <span>{userData.entriesCount} entries</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-[#003DA5]">
                              {userData.cumulativeTotal}
                            </div>
                            <div className="text-xs text-[#00205B]/70">total pts</div>
                          </div>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <div className={`text-xs px-2 py-1 rounded-md ${
                            meetsYearlyGoal ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            This Year: {userData.yearTotal}
                          </div>
                          <div className={`text-xs px-2 py-1 rounded-md ${
                            meetsCumulativeGoal ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            Goal: {required}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Selected User Details */}
          <div className="rounded-2xl bg-white/70 backdrop-blur-md border border-[#003DA5]/15 p-6 shadow-sm">
            <h2 className="text-lg text-[#00205B] font-medium mb-4">Point Entries</h2>

            {!selectedUser ? (
              <div className="text-center py-12 text-sm text-[#00205B]/70">
                <Icon icon="mdi:arrow-left" className="h-12 w-12 mx-auto mb-3 opacity-30" />
                Select a member to view their point entries
              </div>
            ) : loadingEntries ? (
              <div className="text-center py-12 text-sm text-[#00205B]/70">Loading entries...</div>
            ) : userEntries.length === 0 ? (
              <div className="text-center py-12 text-sm text-[#00205B]/70">No entries found</div>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                {userEntries
                  .sort((a, b) => {
                    const dateA = a.date?.seconds ? new Date(a.date.seconds * 1000) : new Date(a.date);
                    const dateB = b.date?.seconds ? new Date(b.date.seconds * 1000) : new Date(b.date);
                    return dateB.getTime() - dateA.getTime();
                  })
                  .map((entry) => {
                    const date = entry.date?.seconds
                      ? new Date(entry.date.seconds * 1000)
                      : new Date(entry.date);

                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-lg border border-[#003DA5]/15 bg-white/60"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-[#00205B]">
                              {entry.activityName}
                            </div>
                            <div className="mt-1 flex items-center gap-2 text-xs text-[#00205B]/70">
                              <Icon icon="mdi:calendar" className="h-3.5 w-3.5" />
                              {date.toLocaleDateString()}
                              <span>•</span>
                              <Icon icon="mdi:school" className="h-3.5 w-3.5" />
                              SY {entry.schoolYear}
                              {entry.hours && (
                                <>
                                  <span>•</span>
                                  <Icon icon="mdi:clock-outline" className="h-3.5 w-3.5" />
                                  {entry.hours}h
                                </>
                              )}
                            </div>
                            {entry.notes && (
                              <div className="mt-1 text-xs text-[#00205B]/60">{entry.notes}</div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 ml-3">
                            <span className="text-sm font-bold text-[#003DA5]">
                              {entry.points} pts
                            </span>
                            <button
                              onClick={() => deleteEntry(entry.id)}
                              className="p-1 rounded-md hover:bg-red-50 text-red-600 transition-colors"
                              title="Delete entry"
                            >
                              <Icon icon="mdi:delete" className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
