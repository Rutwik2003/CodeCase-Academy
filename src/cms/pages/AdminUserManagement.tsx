import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, 
  Shield, 
  Edit3, 
  Trash2, 
  Save,
  X,
  Crown,
  Search,
  User,
  Mail
} from 'lucide-react';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { AdminRole, AdminPermission, AdminUser } from '../utils/adminAuth';
import { useAuth } from '../../contexts/AuthContext';
import { CMSNotificationManager, useCMSNotifications } from '../components/CMSNotification';
import { logger, LogCategory } from '../../utils/logger';

interface AdminFormData {
  email: string;
  role: AdminRole;
  permissions: AdminPermission[];
  isActive: boolean;
}

interface RegularUser {
  uid: string;
  email: string;
  displayName: string;
}

const AdminUserManagement: React.FC = () => {
  const { currentUser } = useAuth();
  const { notifications, addNotification, removeNotification, replaceNotification } = useCMSNotifications();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [regularUsers, setRegularUsers] = useState<RegularUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<string | null>(null);
  const [selectedUserMode, setSelectedUserMode] = useState<'dropdown' | 'manual'>('dropdown');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<RegularUser | null>(null);
  const [deletingAdmin, setDeletingAdmin] = useState<string | null>(null); // Prevent double deletion
  const [formData, setFormData] = useState<AdminFormData>({
    email: '',
    role: AdminRole.ANALYTICS_VIEWER,
    permissions: [],
    isActive: true
  });

  // Role definitions with default permissions
  const roleDefinitions = {
    [AdminRole.SUPER_ADMIN]: {
      label: 'Super Admin',
      description: 'Full system access and control',
      color: 'text-red-400',
      bgColor: 'bg-red-500/10 border-red-500/20',
      permissions: Object.values(AdminPermission)
    },
    [AdminRole.CONTENT_MANAGER]: {
      label: 'Content Manager',
      description: 'Manage cases, content, and achievements',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10 border-purple-500/20',
      permissions: [
        AdminPermission.MANAGE_CASES,
        AdminPermission.VIEW_ANALYTICS,
        AdminPermission.EXPORT_DATA
      ]
    },
    [AdminRole.USER_MANAGER]: {
      label: 'User Manager',
      description: 'Manage regular users and view analytics',
      color: 'text-green-400',
      bgColor: 'bg-green-500/10 border-green-500/20',
      permissions: [
        AdminPermission.MANAGE_USERS,
        AdminPermission.VIEW_ANALYTICS,
        AdminPermission.EXPORT_DATA
      ]
    },
    [AdminRole.ANALYTICS_VIEWER]: {
      label: 'Analytics Viewer',
      description: 'View analytics and export data only',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10 border-blue-500/20',
      permissions: [
        AdminPermission.VIEW_ANALYTICS,
        AdminPermission.EXPORT_DATA
      ]
    }
  };

  const permissionLabels = {
    [AdminPermission.MANAGE_USERS]: 'Manage Users',
    [AdminPermission.MANAGE_CASES]: 'Manage Cases',
    [AdminPermission.VIEW_ANALYTICS]: 'View Analytics',
    [AdminPermission.MANAGE_ADMINS]: 'Manage Admins',
    [AdminPermission.EXPORT_DATA]: 'Export Data',
    [AdminPermission.DELETE_USERS]: 'Delete Users',
    [AdminPermission.SYSTEM_SETTINGS]: 'System Settings'
  };

  useEffect(() => {
    loadAdmins();
    loadRegularUsers();
  }, []);

  const loadRegularUsers = async () => {
    try {
      setLoadingUsers(true);
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersList: RegularUser[] = [];

      usersSnapshot.forEach((doc) => {
        const data = doc.data();
        usersList.push({
          uid: doc.id,
          email: data.email || '',
          displayName: data.displayName || 'Unknown User'
        });
      });

      setRegularUsers(usersList);
    } catch (error) {
      logger.error('Error loading users:', error, LogCategory.CMS);
      addNotification('error', 'Loading Error', 'Failed to load users from database.');
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const adminsSnapshot = await getDocs(collection(db, 'admins'));
      const adminsList: AdminUser[] = [];

      adminsSnapshot.forEach((doc) => {
        const data = doc.data();
        adminsList.push({
          uid: doc.id,
          email: data.email,
          role: data.role,
          permissions: data.permissions || [],
          createdAt: data.createdAt?.toDate() || new Date(),
          lastLogin: data.lastLogin?.toDate() || new Date()
        });
      });

      setAdmins(adminsList);
      // Removed automatic "Admins Loaded" notification to prevent multiple stacked notifications
    } catch (error) {
      logger.error('Error loading admins:', error, LogCategory.CMS);
      addNotification('error', 'Loading Error', 'Failed to load admin users from database.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (role: AdminRole) => {
    const roleDefinition = roleDefinitions[role];
    setFormData({
      ...formData,
      role,
      permissions: roleDefinition.permissions
    });
  };

  const handlePermissionToggle = (permission: AdminPermission) => {
    const newPermissions = formData.permissions.includes(permission)
      ? formData.permissions.filter(p => p !== permission)
      : [...formData.permissions, permission];
    
    setFormData({
      ...formData,
      permissions: newPermissions
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Determine email to use
      const emailToUse = selectedUserMode === 'dropdown' && selectedUser 
        ? selectedUser.email 
        : formData.email;

      if (!emailToUse) {
        replaceNotification('warning', 'Input Required', 'Please select a user or enter an email address.');
        return;
      }

      if (editingAdmin) {
        // Update existing admin
        await updateDoc(doc(db, 'admins', editingAdmin), {
          role: formData.role,
          permissions: formData.permissions,
          isActive: formData.isActive,
          updatedAt: Timestamp.now()
        });
        replaceNotification('success', 'Admin Updated', `Successfully updated ${emailToUse}'s admin permissions.`);
      } else {
        // Create new admin
        const adminId = `admin_${Date.now()}`;
        await setDoc(doc(db, 'admins', adminId), {
          email: emailToUse.toLowerCase(),
          role: formData.role,
          permissions: formData.permissions,
          isActive: formData.isActive,
          createdAt: Timestamp.now(),
          lastLogin: null,
          createdBy: currentUser?.uid
        });
        replaceNotification('success', 'Admin Created', `Successfully granted admin access to ${emailToUse}.`);
      }

      // Reset form and reload
      setFormData({
        email: '',
        role: AdminRole.ANALYTICS_VIEWER,
        permissions: [],
        isActive: true
      });
      setSelectedUser(null);
      setShowAddForm(false);
      setEditingAdmin(null);
      loadAdmins();

    } catch (error) {
      logger.error('Error saving admin:', error, LogCategory.CMS);
      replaceNotification('error', 'Operation Failed', 'Unable to save admin changes. Please try again.');
    }
  };

  const handleEdit = (admin: AdminUser) => {
    setFormData({
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions,
      isActive: true // Assume active if they're in the list
    });
    setEditingAdmin(admin.uid);
    setShowAddForm(true);
  };

  const handleDelete = async (adminId: string) => {
    // Prevent double deletion attempts
    if (deletingAdmin === adminId) return;
    
    const admin = admins.find(a => a.uid === adminId);
    if (!admin) return;

    setDeletingAdmin(adminId);

    // Show professional confirmation via CMS notification
    const notificationId = replaceNotification('warning', 'Confirm Admin Removal', `Remove admin access for ${admin.email}?`, {
      duration: 0, // Don't auto-dismiss
      actions: [
        {
          label: 'Remove Access',
          onClick: async () => {
            try {
              // Clear the confirmation notification first
              if (notificationId) removeNotification(notificationId);
              
              await deleteDoc(doc(db, 'admins', adminId));
              loadAdmins();
              setDeletingAdmin(null); // Reset deletion flag
              replaceNotification('success', 'Access Removed', `${admin.email} no longer has admin access.`);
            } catch (error) {
              logger.error('Error deleting admin:', error, LogCategory.CMS);
              setDeletingAdmin(null); // Reset deletion flag on error
              replaceNotification('error', 'Removal Failed', 'Unable to remove admin access. Please try again.');
            }
          },
          variant: 'primary'
        },
        {
          label: 'Cancel',
          onClick: () => {
            // Properly dismiss the confirmation notification and reset flag
            if (notificationId) removeNotification(notificationId);
            setDeletingAdmin(null);
          },
          variant: 'secondary'
        }
      ]
    });
  };

  // Helper function to reset form
  const resetForm = () => {
    setFormData({
      email: '',
      role: AdminRole.ANALYTICS_VIEWER,
      permissions: [],
      isActive: true
    });
    setSelectedUser(null);
    setSelectedUserMode('dropdown');
    setSearchTerm('');
    setShowAddForm(false);
    setEditingAdmin(null);
  };

  // Filter users based on search term
  const filteredUsers = regularUsers.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading admin users...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Admin User Management</h1>
            <p className="text-white/60">Manage admin users and their permissions</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-lg transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Admin</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Object.entries(roleDefinitions).map(([role, definition]) => {
          const count = admins.filter(admin => admin.role === role).length;
          return (
            <motion.div
              key={role}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${definition.bgColor} backdrop-blur-sm border rounded-xl p-4`}
            >
              <div className="flex items-center space-x-3">
                <Crown className={`w-5 h-5 ${definition.color}`} />
                <div>
                  <div className={`text-sm font-medium ${definition.color}`}>
                    {definition.label}
                  </div>
                  <div className="text-2xl font-bold text-white">{count}</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Admin List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden"
      >
        <div className="p-6 border-b border-slate-700/50">
          <h2 className="text-xl font-bold text-white">Admin Users ({admins.length})</h2>
        </div>
        
        <div className="divide-y divide-slate-700/50">
          {admins.map((admin) => {
            const roleDefinition = roleDefinitions[admin.role];
            return (
              <div key={admin.uid} className="p-6 hover:bg-slate-700/20 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${roleDefinition.bgColor} rounded-lg flex items-center justify-center`}>
                      <Shield className={`w-6 h-6 ${roleDefinition.color}`} />
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-bold text-white">{admin.email}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${roleDefinition.bgColor} ${roleDefinition.color}`}>
                          {roleDefinition.label}
                        </span>
                      </div>
                      <p className="text-white/60 text-sm">{roleDefinition.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-white/50">
                        <span>Created: {admin.createdAt.toLocaleDateString()}</span>
                        <span>Last Login: {admin.lastLogin.toLocaleDateString()}</span>
                        <span>Permissions: {admin.permissions.length}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(admin)}
                      className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                      title="Edit Admin"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(admin.uid)}
                      disabled={deletingAdmin === admin.uid}
                      className={`p-2 rounded-lg transition-colors ${
                        deletingAdmin === admin.uid
                          ? 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                          : 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                      }`}
                      title={deletingAdmin === admin.uid ? 'Deletion in progress...' : 'Remove Admin'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Permissions List */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {admin.permissions.map((permission) => (
                    <span
                      key={permission}
                      className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded"
                    >
                      {permissionLabels[permission]}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Add/Edit Admin Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 rounded-xl border border-slate-700 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                  {editingAdmin ? 'Edit Admin User' : 'Add New Admin User'}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 text-white/60 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all border border-transparent hover:border-red-500/30"
                  title="Close Modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* User Selection */}
                {!editingAdmin && (
                  <div>
                    <label className="block text-white font-medium mb-3">Select User to Make Admin</label>
                    
                    {/* Mode Toggle */}
                    <div className="flex items-center space-x-4 mb-4">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="userMode"
                          checked={selectedUserMode === 'dropdown'}
                          onChange={() => setSelectedUserMode('dropdown')}
                          className="w-4 h-4 text-purple-500"
                        />
                        <span className="text-white">Choose from existing users</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="userMode"
                          checked={selectedUserMode === 'manual'}
                          onChange={() => setSelectedUserMode('manual')}
                          className="w-4 h-4 text-purple-500"
                        />
                        <span className="text-white">Enter email manually</span>
                      </label>
                    </div>

                    {/* Dropdown Selection */}
                    {selectedUserMode === 'dropdown' && (
                      <div className="space-y-3">
                        {/* Search Bar */}
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                          <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search users by email or name..."
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-3 py-2 text-white placeholder-white/60"
                          />
                        </div>

                        {/* User Dropdown */}
                        <div className="max-h-60 overflow-y-auto bg-slate-700 border border-slate-600 rounded-lg custom-scrollbar">
                          {loadingUsers ? (
                            <div className="p-4 text-center text-white/60">Loading users...</div>
                          ) : filteredUsers.length === 0 ? (
                            <div className="p-4 text-center text-white/60">
                              {searchTerm ? 'No users found matching your search.' : 'No users available.'}
                            </div>
                          ) : (
                            <div className="divide-y divide-slate-600">
                              {filteredUsers.map((user) => (
                                <button
                                  key={user.uid}
                                  type="button"
                                  onClick={() => setSelectedUser(user)}
                                  className={`w-full text-left p-3 hover:bg-slate-600/50 transition-colors ${
                                    selectedUser?.uid === user.uid ? 'bg-purple-500/20 border-l-4 border-purple-500' : ''
                                  }`}
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                                      <User className="w-4 h-4 text-purple-400" />
                                    </div>
                                    <div>
                                      <div className="text-white font-medium">{user.displayName}</div>
                                      <div className="text-white/60 text-sm flex items-center space-x-1">
                                        <Mail className="w-3 h-3" />
                                        <span>{user.email}</span>
                                      </div>
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Selected User Display */}
                        {selectedUser && (
                          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-green-400" />
                              </div>
                              <div>
                                <div className="text-green-400 font-medium">Selected: {selectedUser.displayName}</div>
                                <div className="text-green-300 text-sm">{selectedUser.email}</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Manual Email Input */}
                    {selectedUserMode === 'manual' && (
                      <div>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-white/60"
                          placeholder="admin@example.com"
                          required={selectedUserMode === 'manual'}
                        />
                        <p className="text-white/60 text-sm mt-1">
                          Enter the email address of the user you want to make an admin.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Role Selection */}
                <div>
                  <label className="block text-white font-medium mb-2">Admin Role</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(roleDefinitions).map(([role, definition]) => (
                      <label
                        key={role}
                        className={`cursor-pointer ${definition.bgColor} border rounded-lg p-4 transition-all ${
                          formData.role === role ? 'ring-2 ring-purple-500' : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={role}
                          checked={formData.role === role}
                          onChange={(e) => handleRoleChange(e.target.value as AdminRole)}
                          className="sr-only"
                        />
                        <div className="flex items-center space-x-3">
                          <Crown className={`w-5 h-5 ${definition.color}`} />
                          <div>
                            <div className={`font-medium ${definition.color}`}>
                              {definition.label}
                            </div>
                            <div className="text-white/60 text-sm">
                              {definition.description}
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Custom Permissions */}
                <div>
                  <label className="block text-white font-medium mb-2">Custom Permissions</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(permissionLabels).map(([permission, label]) => (
                      <label
                        key={permission}
                        className="flex items-center space-x-3 cursor-pointer bg-slate-700/30 rounded-lg p-3 hover:bg-slate-700/50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(permission as AdminPermission)}
                          onChange={() => handlePermissionToggle(permission as AdminPermission)}
                          className="w-4 h-4 text-purple-500 border-slate-600 rounded focus:ring-purple-500"
                        />
                        <span className="text-white">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center space-x-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-lg transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingAdmin ? 'Update Admin' : 'Create Admin'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingAdmin(null);
                    }}
                    className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-white border border-slate-600 rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CMS Notifications */}
      <CMSNotificationManager 
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  );
};

export default AdminUserManagement;
