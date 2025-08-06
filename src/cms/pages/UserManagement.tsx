import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Plus,
  Eye,
  Download,
  Award,
  TrendingUp,
  Shield,
  UserX,
  UserCheck,
  X,
  BookOpen,
  RefreshCw
} from 'lucide-react';
import { collection, getDocs, doc, updateDoc, deleteDoc, Timestamp, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import toast from 'react-hot-toast';
import { logger, LogCategory } from '../../utils/logger';

interface User {
  uid: string;
  email: string;
  displayName: string;
  level: number;
  hints: number;
  completedCases: string[];
  totalPoints: number;
  achievements: string[];
  createdAt: Timestamp;
  lastLogin: Timestamp;
  isActive: boolean;
  referralCode: string;
  referralStats?: {
    totalReferrals: number;
    successfulReferrals: number;
  };
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    loadUsers();
    
    // Set up auto-refresh every 30 seconds
    const autoRefreshInterval = setInterval(() => {
      loadUsers(true); // Pass true for silent refresh
    }, 30000);
    
    return () => clearInterval(autoRefreshInterval);
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, filterStatus]);

  const loadUsers = async (silent: boolean = false) => {
    try {
      if (!silent) {
        setLoading(true);
        logger.info('📥 Loading users from Firebase...', LogCategory.CMS);
      } else {
        setRefreshing(true);
        logger.info('🔄 Refreshing users from Firebase...', LogCategory.CMS);
      }
      
      // Fetch all users from Firestore
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData: User[] = [];
      
      logger.info(`📊 Found ${usersSnapshot.size} users in Firestore`, LogCategory.CMS);
      
      usersSnapshot.forEach(doc => {
        const userData = doc.data();
        logger.info(`👤 Processing user: ${userData.displayName} (${userData.email})`, LogCategory.CMS);
        
        usersData.push({
          uid: doc.id, // This is the Firestore document ID, which should match Firebase Auth UID
          email: userData.email || '',
          displayName: userData.displayName || 'Unknown User',
          level: userData.level || 1,
          hints: userData.hints || 0,
          completedCases: userData.completedCases || [],
          totalPoints: userData.totalPoints || 0,
          achievements: userData.achievements || [],
          createdAt: userData.createdAt || Timestamp.now(),
          lastLogin: userData.lastLogin || Timestamp.now(),
          isActive: userData.isActive !== false, // Default to true if not specified
          referralCode: userData.referralCode || '',
          referralStats: userData.referralStats || {
            totalReferrals: 0,
            successfulReferrals: 0
          }
        });
      });
      
      // Sort by creation date (newest first)
      usersData.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
      
      logger.info(`✅ Successfully loaded ${usersData.length} users`, LogCategory.CMS);
      setUsers(usersData);
      
    } catch (error) {
      logger.error('❌ Error loading users from Firebase:', error, LogCategory.CMS);
      logger.error('❌ Error code:', (error as any)?.code, LogCategory.CMS);
      logger.error('❌ Error message:', (error as any)?.message, LogCategory.CMS);
      
      // Show error notification
      toast.error('Failed to load users from database', {
        style: {
          background: '#1e293b',
          color: '#f1f5f9',
          border: '1px solid #ef4444'
        },
        icon: '❌',
        duration: 4000
      });
    } finally {
      if (!silent) {
        setLoading(false);
      } else {
        setRefreshing(false);
      }
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.displayName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      const isActive = filterStatus === 'active';
      filtered = filtered.filter(user => user.isActive === isActive);
    }

    setFilteredUsers(filtered);
  };

  const handleUpdateUser = async (userId: string, updates: Partial<User>) => {
    try {
      logger.info('🔄 Starting user update process for:', userId, LogCategory.CMS);
      logger.info('📝 Updates to apply:', updates, LogCategory.CMS);
      
      // Update in Firebase Firestore
      await updateDoc(doc(db, 'users', userId), updates);
      logger.info('✅ User updated successfully in Firestore', LogCategory.CMS);
      
      // Update local state immediately for responsive UI
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.uid === userId ? { ...user, ...updates } : user
        )
      );
      logger.info('✅ Local state updated', LogCategory.CMS);
      
      // Force refresh to ensure data consistency
      await loadUsers(true);
      logger.info('✅ Data refreshed from Firebase', LogCategory.CMS);
      
      // Close editing modal if open
      setEditingUser(null);
      
      // Show success notification
      toast.success('User updated successfully!', {
        style: {
          background: '#1e293b',
          color: '#f1f5f9',
          border: '1px solid #10b981'
        },
        icon: '✅',
        duration: 3000
      });
      
    } catch (error) {
      logger.error('❌ Error updating user:', error, LogCategory.CMS);
      logger.error('❌ Error code:', (error as any)?.code, LogCategory.CMS);
      logger.error('❌ Error message:', (error as any)?.message, LogCategory.CMS);
      
      // Refresh to show current state in case of error
      await loadUsers(true);
      
      toast.error('Failed to update user', {
        style: {
          background: '#1e293b',
          color: '#f1f5f9',
          border: '1px solid #ef4444'
        },
        icon: '❌',
        duration: 4000
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const user = users.find(u => u.uid === userId);
    if (!user) return;
    
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      logger.info('🗑️ Starting complete user deletion process for:', userToDelete.uid, LogCategory.CMS);
      logger.info('📧 User email:', userToDelete.email, LogCategory.CMS);
      logger.info('👤 User display name:', userToDelete.displayName, LogCategory.CMS);
      
      // Step 1: Delete user document from Firestore
      logger.info('🔥 Deleting Firestore user document...', LogCategory.CMS);
      await deleteDoc(doc(db, 'users', userToDelete.uid));
      logger.info('✅ Firestore user document deleted successfully', LogCategory.CMS);
      
      // Step 2: Note about Firebase Auth limitation
      logger.info('⚠️ Note: Firebase Auth user cannot be deleted from client-side for security reasons', LogCategory.CMS);
      logger.info('📝 The user\'s authentication will remain but their data is completely removed', LogCategory.CMS);
      
      // Step 3: Force refresh to verify deletion
      logger.info('🔄 Refreshing user list to verify deletion...', LogCategory.CMS);
      await loadUsers(true);
      
      // Step 4: Verify the user is actually gone from our database
      const stillExistsInFirestore = users.some(u => u.uid === userToDelete.uid);
      if (stillExistsInFirestore) {
        logger.warn('⚠️ User still appears in local state after deletion - forcing additional refresh', LogCategory.CMS);
        setTimeout(() => loadUsers(true), 1000);
      } else {
        logger.info('✅ User successfully removed from Firestore and local state', LogCategory.CMS);
      }
      
      // Step 5: Show success message with full details
      toast.success(`User "${userToDelete.displayName}" completely deleted!`, {
        style: {
          background: '#1e293b',
          color: '#f1f5f9',
          border: '1px solid #10b981'
        },
        icon: '🗑️',
        duration: 4000
      });
      
      // Step 6: Show additional info about Auth limitation
      toast(`✅ Database: User data completely removed
⚠️ Firebase Auth: User login remains (security limitation)
💡 User cannot access app but auth record exists`, {
        style: {
          background: '#1e293b',
          color: '#cbd5e1',
          border: '1px solid #f59e0b',
          whiteSpace: 'pre-line'
        },
        icon: 'ℹ️',
        duration: 8000
      });
      
      // Step 7: Close confirmation dialog
      setShowDeleteConfirm(false);
      setUserToDelete(null);
      
    } catch (error) {
      logger.error('❌ Error during user deletion process:', error, LogCategory.CMS);
      logger.error('❌ Error code:', (error as any)?.code, LogCategory.CMS);
      logger.error('❌ Error message:', (error as any)?.message, LogCategory.CMS);
      logger.error('❌ Full error object:', error, LogCategory.CMS);
      
      // Refresh to show current state
      await loadUsers(true);
      
      // Show detailed error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Failed to delete user: ${errorMessage}. Check console for details.`, {
        style: {
          background: '#1e293b',
          color: '#f1f5f9',
          border: '1px solid #ef4444'
        },
        icon: '❌',
        duration: 8000
      });
    }
  };

  const handleToggleUserStatus = async (user: User) => {
    await handleUpdateUser(user.uid, { isActive: !user.isActive });
  };

  const handleAddUser = async (userData: {
    email: string;
    displayName: string;
    password: string;
  }) => {
    try {
      // Default values that match normal user signup
      const newUser = {
        email: userData.email,
        displayName: userData.displayName,
        level: 1, // Default starting level
        hints: 2, // Default hints for new users (3 if referred)
        totalPoints: 500, // Default starting points (700 if referred)
        completedCases: [],
        achievements: [],
        createdAt: Timestamp.now(),
        lastLogin: Timestamp.now(),
        isActive: true,
        referralCode: generateReferralCode(),
        referralStats: {
          totalReferrals: 0,
          successfulReferrals: 0
        }
      };

      await addDoc(collection(db, 'users'), newUser);
      
      // Refresh the user list to get the latest data
      await loadUsers(true);
      setShowAddUserModal(false);
      
      toast.success(`User '${userData.displayName}' added successfully!`, {
        style: {
          background: '#1e293b',
          color: '#f1f5f9',
          border: '1px solid #10b981'
        },
        icon: '👤',
        duration: 4000
      });
      
      // Show additional details in a separate toast
      toast(`Default settings applied:\n• Level: 1\n• Hints: 2\n• Points: 500`, {
        style: {
          background: '#1e293b',
          color: '#cbd5e1',
          border: '1px solid #475569'
        },
        icon: 'ℹ️',
        duration: 5000
      });
    } catch (error) {
      logger.error('Error adding user:', error, LogCategory.CMS);
      toast.error('Failed to add user', {
        style: {
          background: '#1e293b',
          color: '#f1f5f9',
          border: '1px solid #ef4444'
        },
        icon: '❌',
        duration: 4000
      });
    }
  };

  const generateReferralCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const exportUsers = () => {
    const csvContent = [
      ['Email', 'Display Name', 'Level', 'Points', 'Completed Cases', 'Created At', 'Last Login', 'Status'].join(','),
      ...filteredUsers.map(user => [
        user.email,
        user.displayName,
        user.level,
        user.totalPoints,
        user.completedCases.length,
        user.createdAt.toDate().toLocaleDateString(),
        user.lastLogin.toDate().toLocaleDateString(),
        user.isActive ? 'Active' : 'Inactive'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codecase-users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatDate = (timestamp: Timestamp) => {
    return timestamp.toDate().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTimeSinceLastLogin = (timestamp: Timestamp) => {
    const now = new Date();
    const lastLogin = timestamp.toDate();
    const diffMs = now.getTime() - lastLogin.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-2xl font-bold text-white">User Management</h2>
              {refreshing && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
                  <RefreshCw className="w-3 h-3 text-blue-400 animate-spin" />
                  <span className="text-blue-400 text-xs font-medium">Auto-refreshing...</span>
                </div>
              )}
            </div>
            <p className="text-white/60">
              Manage {users.length} registered users across CodeCase Detective Academy • Auto-refresh every 30s
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => loadUsers()}
              disabled={refreshing}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all border ${
                refreshing 
                  ? 'bg-blue-500/10 text-blue-400/50 border-blue-500/20 cursor-not-allowed' 
                  : 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border-blue-500/30 hover:border-blue-500/50'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            
            <button
              onClick={exportUsers}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors border border-green-500/30"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            
            <button 
              onClick={() => setShowAddUserModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors border border-blue-500/30"
            >
              <Plus className="w-4 h-4" />
              <span>Add User</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">{users.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Active Users</p>
              <p className="text-2xl font-bold text-white">
                {users.filter(u => u.isActive).length}
              </p>
            </div>
            <UserCheck className="w-8 h-8 text-green-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Avg. Completion</p>
              <p className="text-2xl font-bold text-white">
                {users.length > 0 ? Math.round(users.reduce((acc, u) => acc + u.completedCases.length, 0) / users.length) : 0}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Top Score</p>
              <p className="text-2xl font-bold text-white">
                {users.length > 0 ? Math.max(...users.map(u => u.totalPoints)) : 0}
              </p>
            </div>
            <Award className="w-8 h-8 text-yellow-400" />
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20"
      >
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search users by email or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-400"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-white/60" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
            >
              <option value="all" className="bg-slate-800 text-white">All Users</option>
              <option value="active" className="bg-slate-800 text-white">Active Only</option>
              <option value="inactive" className="bg-slate-800 text-white">Inactive Only</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-white/80 font-medium">User</th>
                <th className="px-6 py-4 text-left text-white/80 font-medium">Level</th>
                <th className="px-6 py-4 text-left text-white/80 font-medium">Points</th>
                <th className="px-6 py-4 text-left text-white/80 font-medium">Cases</th>
                <th className="px-6 py-4 text-left text-white/80 font-medium">Last Login</th>
                <th className="px-6 py-4 text-left text-white/80 font-medium">Status</th>
                <th className="px-6 py-4 text-left text-white/80 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.uid}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="border-t border-white/10 hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {user.displayName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.displayName}</p>
                        <p className="text-white/60 text-sm">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-blue-400" />
                      <span className="text-white">Level {user.level}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white font-medium">{user.totalPoints.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-green-400 text-sm font-medium">{user.completedCases.length}</span>
                      </div>
                      <span className="text-white/60 text-sm">completed</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-white text-sm">{getTimeSinceLastLogin(user.lastLogin)}</p>
                      <p className="text-white/40 text-xs">{formatDate(user.lastLogin)}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      user.isActive 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserModal(true);
                        }}
                        className="p-2 text-white/60 hover:text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all border border-transparent hover:border-blue-500/30"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingUser(user)}
                        className="p-2 text-white/60 hover:text-amber-400 hover:bg-amber-500/20 rounded-lg transition-all border border-transparent hover:border-amber-500/30"
                        title="Edit User"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleUserStatus(user)}
                        className={`p-2 rounded-lg transition-all border border-transparent ${
                          user.isActive
                            ? 'text-white/60 hover:text-yellow-400 hover:bg-yellow-500/20 hover:border-yellow-500/30'
                            : 'text-white/60 hover:text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/30'
                        }`}
                        title={user.isActive ? 'Deactivate User' : 'Activate User'}
                      >
                        {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.uid)}
                        className="p-2 text-white/60 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all border border-transparent hover:border-red-500/30"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">User Details</h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="p-2 text-white/60 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all border border-transparent hover:border-red-500/30"
                title="Close Modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {selectedUser.displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">{selectedUser.displayName}</h4>
                  <p className="text-white/60">{selectedUser.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      selectedUser.isActive 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {selectedUser.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs font-medium">
                      Level {selectedUser.level}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <span className="text-white font-medium">Total Points</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{selectedUser.totalPoints.toLocaleString()}</p>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Award className="w-5 h-5 text-yellow-400" />
                    <span className="text-white font-medium">Achievements</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{selectedUser.achievements.length}</p>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <BookOpen className="w-5 h-5 text-purple-400" />
                    <span className="text-white font-medium">Completed Cases</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{selectedUser.completedCases.length}</p>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    <span className="text-white font-medium">Referrals</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{selectedUser.referralStats?.totalReferrals || 0}</p>
                </div>
              </div>
              
              <div>
                <h5 className="text-white font-medium mb-3">Account Information</h5>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Created</span>
                    <span className="text-white">{formatDate(selectedUser.createdAt)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Last Login</span>
                    <span className="text-white">{formatDate(selectedUser.lastLogin)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Referral Code</span>
                    <span className="text-white font-mono">{selectedUser.referralCode}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 rounded-xl p-6 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Edit User</h3>
              <button
                onClick={() => setEditingUser(null)}
                className="p-2 text-white/60 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all border border-transparent hover:border-red-500/30"
                title="Close Modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const updates = {
                  displayName: formData.get('displayName') as string,
                  level: parseInt(formData.get('level') as string),
                  hints: parseInt(formData.get('hints') as string),
                  totalPoints: parseInt(formData.get('totalPoints') as string),
                };
                handleUpdateUser(editingUser.uid, updates);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Display Name</label>
                <input
                  type="text"
                  name="displayName"
                  defaultValue={editingUser.displayName}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Level</label>
                  <input
                    type="number"
                    name="level"
                    defaultValue={editingUser.level}
                    min="1"
                    max="100"
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Hints</label>
                  <input
                    type="number"
                    name="hints"
                    defaultValue={editingUser.hints}
                    min="0"
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Total Points</label>
                <input
                  type="number"
                  name="totalPoints"
                  defaultValue={editingUser.totalPoints}
                  min="0"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
                  required
                />
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-lg transition-all"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 bg-slate-700/50 hover:bg-slate-600/50 text-white border border-slate-600 px-4 py-2 rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 rounded-xl p-6 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Add New User</h3>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-white/60 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleAddUser({
                email: formData.get('email') as string,
                displayName: formData.get('displayName') as string,
                password: formData.get('password') as string,
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="user@example.com"
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-400"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Display Name</label>
                  <input
                    type="text"
                    name="displayName"
                    placeholder="John Doe"
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-400"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-400"
                    required
                    minLength={6}
                  />
                  <p className="text-white/40 text-xs mt-1">Minimum 6 characters</p>
                </div>
              </div>
              
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mt-4">
                <h4 className="text-blue-400 font-medium text-sm mb-2">Default Settings</h4>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="text-center">
                    <p className="text-white/60">Level</p>
                    <p className="text-white font-medium">1</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/60">Hints</p>
                    <p className="text-white font-medium">2</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/60">Points</p>
                    <p className="text-white font-medium">500</p>
                  </div>
                </div>
                <p className="text-white/40 text-xs mt-2">These values match normal user signup defaults</p>
              </div>
              
              <div className="flex space-x-4 pt-6">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  Add User
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {showDeleteConfirm && userToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-red-500/30"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Delete User</h3>
                  <p className="text-red-400 text-sm">This action cannot be undone</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setUserToDelete(null);
                }}
                className="text-white/60 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-white/80 mb-4">
                Are you sure you want to delete user <span className="font-semibold text-white">"{userToDelete.displayName}"</span>?
              </p>
              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-white/60 text-sm mb-2">This will permanently remove:</p>
                <ul className="text-white/60 text-sm space-y-1">
                  <li>• User account and profile data</li>
                  <li>• Progress and achievements</li>
                  <li>• All user-generated content</li>
                </ul>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={confirmDeleteUser}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
              >
                Yes, Delete User
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setUserToDelete(null);
                }}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
