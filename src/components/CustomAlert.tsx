import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, CheckCircle, Info, XCircle, Shield } from 'lucide-react';

export interface AlertOptions {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
  autoClose?: number; // Auto close after x milliseconds
}

interface AlertState extends AlertOptions {
  id: string;
  isVisible: boolean;
}

// Global alert manager
class AlertManager {
  private alerts: AlertState[] = [];
  private listeners: ((alerts: AlertState[]) => void)[] = [];

  subscribe(listener: (alerts: AlertState[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener([...this.alerts]));
  }

  show(options: AlertOptions): Promise<boolean> {
    return new Promise((resolve) => {
      const id = Math.random().toString(36).substr(2, 9);
      const alert: AlertState = {
        ...options,
        id,
        isVisible: true,
        onConfirm: () => {
          this.hide(id);
          options.onConfirm?.();
          resolve(true);
        },
        onCancel: () => {
          this.hide(id);
          options.onCancel?.();
          resolve(false);
        }
      };

      this.alerts.push(alert);
      this.notify();

      // Auto close if specified
      if (options.autoClose) {
        setTimeout(() => {
          this.hide(id);
          resolve(false);
        }, options.autoClose);
      }
    });
  }

  hide(id: string) {
    this.alerts = this.alerts.filter(alert => alert.id !== id);
    this.notify();
  }

  hideAll() {
    this.alerts = [];
    this.notify();
  }
}

export const alertManager = new AlertManager();

// Custom alert function
export const showAlert = (message: string, options?: Omit<AlertOptions, 'message'>) => {
  return alertManager.show({ ...options, message });
};

// Custom confirm function
export const showConfirm = (message: string, options?: Omit<AlertOptions, 'message' | 'showCancel'>) => {
  return alertManager.show({ 
    ...options, 
    message, 
    showCancel: true,
    type: options?.type || 'warning'
  });
};

// Alert component with detective theme
const CustomAlert: React.FC<{ alert: AlertState }> = ({ alert }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  const getIcon = () => {
    switch (alert.type) {
      case 'success':
        return <CheckCircle className="w-7 h-7 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-7 h-7 text-amber-400" />;
      case 'error':
        return <XCircle className="w-7 h-7 text-red-400" />;
      default:
        return <Info className="w-7 h-7 text-blue-400" />;
    }
  };

  const getAccentColor = () => {
    switch (alert.type) {
      case 'success':
        return 'border-green-400/30 shadow-green-400/20';
      case 'warning':
        return 'border-amber-400/30 shadow-amber-400/20';
      case 'error':
        return 'border-red-400/30 shadow-red-400/20';
      default:
        return 'border-blue-400/30 shadow-blue-400/20';
    }
  };

  const getButtonColors = () => {
    switch (alert.type) {
      case 'success':
        return 'bg-gradient-to-r from-green-600/80 to-green-500/80 hover:from-green-500/90 hover:to-green-400/90 border-green-400/30';
      case 'warning':
        return 'bg-gradient-to-r from-amber-600/80 to-amber-500/80 hover:from-amber-500/90 hover:to-amber-400/90 border-amber-400/30';
      case 'error':
        return 'bg-gradient-to-r from-red-600/80 to-red-500/80 hover:from-red-500/90 hover:to-red-400/90 border-red-400/30';
      default:
        return 'bg-gradient-to-r from-blue-600/80 to-blue-500/80 hover:from-blue-500/90 hover:to-blue-400/90 border-blue-400/30';
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop with detective theme */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xl"></div>
      
      {/* Alert modal with glassmorphism */}
      <div 
        className={`
          relative bg-slate-800/90 backdrop-blur-xl border ${getAccentColor()}
          rounded-2xl shadow-2xl max-w-md w-full p-8
          transform transition-all duration-500 ease-out
          ${isAnimating ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}
        `}
      >
        {/* Header with detective styling */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start space-x-4">
            {/* Icon with detective badge effect */}
            <div className="p-3 bg-slate-700/50 rounded-xl border border-slate-600/50 backdrop-blur-sm">
              {getIcon()}
            </div>
            
            <div className="flex-1">
              {alert.title && (
                <h3 className="text-xl font-bold text-slate-100 mb-2 tracking-wide">
                  {alert.title}
                </h3>
              )}
              <p className="text-slate-300 leading-relaxed">
                {alert.message}
              </p>
            </div>
          </div>
          
          {/* Close button - only show if not confirmation dialog */}
          {!alert.showCancel && !alert.confirmText && (
            <button
              onClick={alert.onCancel}
              className="text-slate-400 hover:text-slate-200 transition-colors p-2 hover:bg-slate-700/50 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Detective-style separator */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-600/50 to-transparent mb-6"></div>

        {/* Buttons with detective theme */}
        <div className="flex space-x-3">
          {alert.showCancel && (
            <button
              onClick={alert.onCancel}
              className="flex-1 px-6 py-3 bg-slate-700/60 hover:bg-slate-600/70 text-slate-300 hover:text-slate-100 
                         rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm
                         border border-slate-600/50 hover:border-slate-500/50"
            >
              {alert.cancelText || 'Cancel'}
            </button>
          )}
          
          <button
            onClick={alert.onConfirm}
            className={`
              ${alert.showCancel ? 'flex-1' : 'w-full'} px-6 py-3 text-white font-semibold rounded-xl
              transition-all duration-300 backdrop-blur-sm border
              ${getButtonColors()}
              shadow-lg hover:shadow-xl transform hover:scale-105
            `}
          >
            {alert.confirmText || 'OK'}
          </button>
        </div>

        {/* Detective badge watermark */}
        <div className="absolute top-4 right-4 opacity-10">
          <Shield className="w-8 h-8 text-amber-400" />
        </div>
      </div>
    </div>
  );
};

// Alert container component
export const AlertContainer: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertState[]>([]);

  useEffect(() => {
    return alertManager.subscribe(setAlerts);
  }, []);

  return (
    <>
      {alerts.map(alert => (
        <CustomAlert key={alert.id} alert={alert} />
      ))}
    </>
  );
};

export default CustomAlert;
