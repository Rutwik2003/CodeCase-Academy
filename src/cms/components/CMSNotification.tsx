import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, Info, X, AlertCircle } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface CMSNotificationProps {
  type: NotificationType;
  title: string;
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  }[];
}

export const CMSNotification: React.FC<CMSNotificationProps> = ({
  type,
  title,
  message,
  isVisible,
  onClose,
  duration = 5000,
  actions
}) => {
  React.useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-500/10 border-green-500/20',
          text: 'text-green-400',
          icon: CheckCircle
        };
      case 'error':
        return {
          bg: 'bg-red-500/10 border-red-500/20',
          text: 'text-red-400',
          icon: AlertCircle
        };
      case 'warning':
        return {
          bg: 'bg-yellow-500/10 border-yellow-500/20',
          text: 'text-yellow-400',
          icon: AlertTriangle
        };
      case 'info':
        return {
          bg: 'bg-blue-500/10 border-blue-500/20',
          text: 'text-blue-400',
          icon: Info
        };
    }
  };

  const styles = getTypeStyles();
  const IconComponent = styles.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed top-4 right-4 z-50 max-w-md"
        >
          <div className={`${styles.bg} border rounded-xl p-4 backdrop-blur-xl shadow-2xl`}>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <IconComponent className={`w-5 h-5 ${styles.text}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold text-sm mb-1">
                  {title}
                </h4>
                <p className="text-white/80 text-sm leading-relaxed">
                  {message}
                </p>
                
                {actions && actions.length > 0 && (
                  <div className="flex items-center space-x-2 mt-3">
                    {actions.map((action, index) => (
                      <button
                        key={index}
                        onClick={action.onClick}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                          action.variant === 'primary'
                            ? `bg-${type === 'success' ? 'green' : type === 'error' ? 'red' : type === 'warning' ? 'yellow' : 'blue'}-500 hover:bg-${type === 'success' ? 'green' : type === 'error' ? 'red' : type === 'warning' ? 'yellow' : 'blue'}-600 text-white`
                            : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                        }`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <button
                onClick={onClose}
                className="flex-shrink-0 text-white/60 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Notification Manager for handling multiple notifications
interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  }[];
}

interface CMSNotificationManagerProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

export const CMSNotificationManager: React.FC<CMSNotificationManagerProps> = ({
  notifications,
  onRemove
}) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {notifications.map((notification, index) => (
        <motion.div
          key={notification.id}
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ 
            opacity: 1, 
            y: index * 80, // Stack notifications
            scale: 1 
          }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <CMSNotification
            {...notification}
            isVisible={true}
            onClose={() => onRemove(notification.id)}
          />
        </motion.div>
      ))}
    </div>
  );
};

// Hook for managing CMS notifications
export const useCMSNotifications = () => {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  const addNotification = (
    type: NotificationType,
    title: string,
    message: string,
    options?: {
      duration?: number;
      actions?: {
        label: string;
        onClick: () => void;
        variant?: 'primary' | 'secondary';
      }[];
    }
  ) => {
    const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const notification: Notification = {
      id,
      type,
      title,
      message,
      duration: options?.duration,
      actions: options?.actions
    };

    setNotifications(prev => [...prev, notification]);
    return id;
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll
  };
};
