import { User } from 'firebase/auth';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { logger, LogCategory } from '../../utils/logger';

// Admin user emails - you can modify this list
const ADMIN_EMAILS = [
  'rutwik@gmail.com',
  'vasanth@gmail.com', // Add more admin emails as needed
];

// Super admin emails - these users can manage other admins
const SUPER_ADMIN_EMAILS = [
  'rutwik@gmail.com', // Primary super admin
];

// Admin roles for more granular permissions
export enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  CONTENT_MANAGER = 'content_manager', 
  USER_MANAGER = 'user_manager',
  ANALYTICS_VIEWER = 'analytics_viewer'
}

export interface AdminUser {
  uid: string;
  email: string;
  role: AdminRole;
  permissions: AdminPermission[];
  createdAt: Date;
  lastLogin: Date;
}

export enum AdminPermission {
  MANAGE_USERS = 'manage_users',
  MANAGE_CASES = 'manage_cases',
  VIEW_ANALYTICS = 'view_analytics',
  MANAGE_ADMINS = 'manage_admins',
  EXPORT_DATA = 'export_data',
  DELETE_USERS = 'delete_users',
  SYSTEM_SETTINGS = 'system_settings'
}

// Check if user is admin by email
export const isAdminEmail = (email: string): boolean => {
  return ADMIN_EMAILS.includes(email.toLowerCase());
};

// Check if user is super admin by email
export const isSuperAdminEmail = (email: string): boolean => {
  return SUPER_ADMIN_EMAILS.includes(email.toLowerCase());
};

// Initialize super admin in Firestore
export const initializeSuperAdmin = async (user: User): Promise<void> => {
  if (!user.email || !isSuperAdminEmail(user.email)) return;
  
  try {
    const adminDoc = await getDoc(doc(db, 'admins', user.uid));
    
    // If admin document doesn't exist, create it
    if (!adminDoc.exists()) {
      await setDoc(doc(db, 'admins', user.uid), {
        email: user.email.toLowerCase(),
        role: AdminRole.SUPER_ADMIN,
        permissions: Object.values(AdminPermission),
        isActive: true,
        createdAt: Timestamp.now(),
        lastLogin: Timestamp.now(),
        createdBy: 'system'
      });
      logger.info(LogCategory.CMS, 'Super admin initialized:', user.email);
    }
  } catch (error) {
    logger.error(LogCategory.CMS, 'Error initializing super admin:', error);
  }
};

// Check if user has admin privileges
export const checkAdminAccess = async (user: User): Promise<boolean> => {
  if (!user || !user.email) return false;
  
  // First check if email is in admin list
  if (!isAdminEmail(user.email)) return false;
  
  try {
    // Initialize super admin if needed
    await initializeSuperAdmin(user);
    
    // Check if admin document exists in Firestore
    const adminDoc = await getDoc(doc(db, 'admins', user.uid));
    
    // If admin document exists and is active
    if (adminDoc.exists()) {
      const adminData = adminDoc.data();
      return adminData.isActive === true;
    }
    
    // If no admin document but email is in list, consider as admin
    return true;
  } catch (error) {
    logger.error(LogCategory.CMS, 'Error checking admin access:', error);
    return false;
  }
};

// Get admin user data
export const getAdminUserData = async (user: User): Promise<AdminUser | null> => {
  if (!user || !user.email) return null;
  
  try {
    const adminDoc = await getDoc(doc(db, 'admins', user.uid));
    
    if (adminDoc.exists()) {
      const adminData = adminDoc.data();
      return {
        uid: user.uid,
        email: user.email,
        role: adminData.role || AdminRole.CONTENT_MANAGER,
        permissions: adminData.permissions || [],
        createdAt: adminData.createdAt?.toDate() || new Date(),
        lastLogin: new Date()
      };
    }
    
    // Default admin data for email-based admins
    return {
      uid: user.uid,
      email: user.email,
      role: AdminRole.SUPER_ADMIN, // Default role for email-based admins
      permissions: Object.values(AdminPermission),
      createdAt: new Date(),
      lastLogin: new Date()
    };
  } catch (error) {
    logger.error(LogCategory.CMS, 'Error getting admin user data:', error);
    return null;
  }
};

// Check if admin has specific permission
export const hasPermission = (adminUser: AdminUser, permission: AdminPermission): boolean => {
  // Super admins have all permissions
  if (adminUser.role === AdminRole.SUPER_ADMIN) return true;
  
  return adminUser.permissions.includes(permission);
};

// Role-based permission mapping
export const getRolePermissions = (role: AdminRole): AdminPermission[] => {
  switch (role) {
    case AdminRole.SUPER_ADMIN:
      return Object.values(AdminPermission);
    
    case AdminRole.CONTENT_MANAGER:
      return [
        AdminPermission.MANAGE_CASES,
        AdminPermission.VIEW_ANALYTICS
      ];
    
    case AdminRole.USER_MANAGER:
      return [
        AdminPermission.MANAGE_USERS,
        AdminPermission.VIEW_ANALYTICS,
        AdminPermission.EXPORT_DATA
      ];
    
    case AdminRole.ANALYTICS_VIEWER:
      return [
        AdminPermission.VIEW_ANALYTICS
      ];
    
    default:
      return [];
  }
};
