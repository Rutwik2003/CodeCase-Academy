import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { useAuth } from '../../contexts/AuthContext';
import { AdminUser, checkAdminAccess, getAdminUserData, AdminPermission, hasPermission } from '../utils/adminAuth';
import { logger, LogCategory } from '../../utils/logger';

interface AdminContextType {
  isAdmin: boolean;
  isLoading: boolean;
  adminUser: AdminUser | null;
  hasPermission: (permission: AdminPermission) => boolean;
  refreshAdminStatus: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  isLoading: true,
  adminUser: null,
  hasPermission: () => false,
  refreshAdminStatus: async () => {}
});

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  const checkAndSetAdminStatus = async (currentUser: User | null) => {
    setIsLoading(true);
    
    if (!currentUser) {
      setIsAdmin(false);
      setAdminUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const hasAccess = await checkAdminAccess(currentUser);
      
      if (hasAccess) {
        const adminData = await getAdminUserData(currentUser);
        setIsAdmin(true);
        setAdminUser(adminData);
      } else {
        setIsAdmin(false);
        setAdminUser(null);
      }
    } catch (error) {
      logger.error(LogCategory.CMS, 'Error checking admin status:', error);
      setIsAdmin(false);
      setAdminUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAdminStatus = async () => {
    await checkAndSetAdminStatus(currentUser);
  };

  const checkPermission = (permission: AdminPermission): boolean => {
    if (!adminUser) return false;
    return hasPermission(adminUser, permission);
  };

  useEffect(() => {
    checkAndSetAdminStatus(currentUser);
  }, [currentUser]);

  const value: AdminContextType = {
    isAdmin,
    isLoading,
    adminUser,
    hasPermission: checkPermission,
    refreshAdminStatus
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
