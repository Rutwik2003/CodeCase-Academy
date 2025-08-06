import toast from 'react-hot-toast';

interface ToastOptions {
  duration?: number;
  preventDuplicate?: boolean;
  id?: string;
}

class ProfessionalToastManager {
  private activeToasts = new Set<string>();
  private duplicatePrevention = new Map<string, number>();

  private generateToastKey(type: string, title: string): string {
    return `${type}:${title}`;
  }

  private preventDuplicate(key: string, preventDuplicate: boolean): boolean {
    if (!preventDuplicate) return false;

    const lastShown = this.duplicatePrevention.get(key);
    const now = Date.now();

    if (lastShown && now - lastShown < 3000) {
      return true; // Prevent showing the same toast within 3 seconds
    }

    this.duplicatePrevention.set(key, now);
    return false;
  }

  private cleanupToast(toastId: string, key?: string) {
    this.activeToasts.delete(toastId);
    if (key) {
      // Clean up duplicate prevention after a delay
      setTimeout(() => {
        this.duplicatePrevention.delete(key);
      }, 5000);
    }
  }

  success(
    title: string, 
    message?: string, 
    options: ToastOptions = {}
  ): string | null {
    const key = this.generateToastKey('success', title);
    
    if (this.preventDuplicate(key, options.preventDuplicate !== false)) {
      return null;
    }

    const content = message ? `${title}\n${message}` : title;
    
    const toastId = toast.success(content, {
      duration: options.duration || 3000,
      id: options.id,
      style: {
        background: '#0f172a',
        color: '#ffffff',
        border: '1px solid rgba(34, 197, 94, 0.2)',
        borderRadius: '12px',
        fontSize: '14px',
        maxWidth: '400px',
      },
      iconTheme: {
        primary: '#22c55e',
        secondary: '#ffffff',
      },
    });

    this.activeToasts.add(toastId);
    
    // Auto-cleanup
    setTimeout(() => {
      this.cleanupToast(toastId, key);
    }, options.duration || 3000);

    return toastId;
  }

  error(
    title: string, 
    message?: string, 
    options: ToastOptions = {}
  ): string | null {
    const key = this.generateToastKey('error', title);
    
    if (this.preventDuplicate(key, options.preventDuplicate !== false)) {
      return null;
    }

    const content = message ? `${title}\n${message}` : title;
    
    const toastId = toast.error(content, {
      duration: options.duration || 6000,
      id: options.id,
      style: {
        background: '#0f172a',
        color: '#ffffff',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        borderRadius: '12px',
        fontSize: '14px',
        maxWidth: '400px',
      },
      iconTheme: {
        primary: '#ef4444',
        secondary: '#ffffff',
      },
    });

    this.activeToasts.add(toastId);
    
    // Auto-cleanup
    setTimeout(() => {
      this.cleanupToast(toastId, key);
    }, options.duration || 6000);

    return toastId;
  }

  warning(
    title: string, 
    message?: string, 
    options: ToastOptions = {}
  ): string | null {
    const key = this.generateToastKey('warning', title);
    
    if (this.preventDuplicate(key, options.preventDuplicate !== false)) {
      return null;
    }

    const content = message ? `${title}\n${message}` : title;
    
    const toastId = toast(content, {
      duration: options.duration || 4000,
      id: options.id,
      icon: '⚠️',
      style: {
        background: '#0f172a',
        color: '#ffffff',
        border: '1px solid rgba(251, 191, 36, 0.2)',
        borderRadius: '12px',
        fontSize: '14px',
        maxWidth: '400px',
      },
    });

    this.activeToasts.add(toastId);
    
    // Auto-cleanup
    setTimeout(() => {
      this.cleanupToast(toastId, key);
    }, options.duration || 4000);

    return toastId;
  }

  info(
    title: string, 
    message?: string, 
    options: ToastOptions = {}
  ): string | null {
    const key = this.generateToastKey('info', title);
    
    if (this.preventDuplicate(key, options.preventDuplicate !== false)) {
      return null;
    }

    const content = message ? `${title}\n${message}` : title;
    
    const toastId = toast(content, {
      duration: options.duration || 4000,
      id: options.id,
      icon: 'ℹ️',
      style: {
        background: '#0f172a',
        color: '#ffffff',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: '12px',
        fontSize: '14px',
        maxWidth: '400px',
      },
    });

    this.activeToasts.add(toastId);
    
    // Auto-cleanup
    setTimeout(() => {
      this.cleanupToast(toastId, key);
    }, options.duration || 4000);

    return toastId;
  }

  replace(type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string, options: ToastOptions = {}): string | null {
    const key = this.generateToastKey(type, title);
    
    // Dismiss any existing toast with the same key
    toast.dismiss();
    this.activeToasts.clear();
    this.duplicatePrevention.delete(key);
    
    // Add new toast
    return this[type](title, message, { ...options, preventDuplicate: false });
  }

  dismiss(toastId?: string) {
    if (toastId) {
      toast.dismiss(toastId);
      this.activeToasts.delete(toastId);
    } else {
      toast.dismiss();
      this.activeToasts.clear();
    }
  }

  dismissAll() {
    toast.dismiss();
    this.activeToasts.clear();
    this.duplicatePrevention.clear();
  }

  // Get count of active toasts (for debugging)
  getActiveCount(): number {
    return this.activeToasts.size;
  }
}

// Export singleton instance
export const professionalToast = new ProfessionalToastManager();

// Export convenience function for quick access
export const showToast = professionalToast;
