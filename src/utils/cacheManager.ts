// Advanced Cache Manager for Detective Academy
interface CacheItem<T = any> {
  data: T;
  timestamp: number;
  expiry?: number;
  version?: string;
}

interface CacheOptions {
  expiry?: number; // in milliseconds
  version?: string;
  compress?: boolean;
}

class CacheManager {
  private readonly prefix = 'detective_academy_';
  private readonly currentVersion = '1.0.0';

  // Compression helpers
  private compress(data: string): string {
    try {
      // Simple LZ-string style compression for large data
      return btoa(encodeURIComponent(data));
    } catch {
      return data;
    }
  }

  private decompress(data: string): string {
    try {
      return decodeURIComponent(atob(data));
    } catch {
      return data;
    }
  }

  // Set item in localStorage with optional expiry and compression
  set<T>(key: string, data: T, options: CacheOptions = {}): boolean {
    try {
      const item: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        expiry: options.expiry ? Date.now() + options.expiry : undefined,
        version: options.version || this.currentVersion
      };

      let serialized = JSON.stringify(item);
      
      if (options.compress && serialized.length > 1000) {
        serialized = this.compress(serialized);
      }

      localStorage.setItem(this.prefix + key, serialized);
      return true;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        // logger.warn(`Failed to cache item ${key}:`, error, LogCategory.UTILITY); // COMMENTED FOR PRODUCTION
      }
      return false;
    }
  }

  // Get item from localStorage with expiry check
  get<T>(key: string): T | null {
    try {
      const stored = localStorage.getItem(this.prefix + key);
      if (!stored) return null;

      let item: CacheItem<T>;
      
      try {
        item = JSON.parse(stored);
      } catch {
        // Try decompressing first
        const decompressed = this.decompress(stored);
        item = JSON.parse(decompressed);
      }

      // Check expiry
      if (item.expiry && Date.now() > item.expiry) {
        this.remove(key);
        return null;
      }

      // Check version compatibility
      if (item.version && item.version !== this.currentVersion) {
        this.remove(key);
        return null;
      }

      return item.data;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        // logger.warn(`Failed to retrieve cached item ${key}:`, error, LogCategory.UTILITY); // COMMENTED FOR PRODUCTION
      }
      this.remove(key); // Remove corrupted data
      return null;
    }
  }

  // Remove item from cache
  remove(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }

  // Clear all cache items
  clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }

  // Get cache size and statistics
  getStats(): { count: number; size: number; items: string[] } {
    const keys = Object.keys(localStorage).filter(key => key.startsWith(this.prefix));
    let totalSize = 0;
    
    keys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        totalSize += new Blob([value]).size;
      }
    });

    return {
      count: keys.length,
      size: totalSize,
      items: keys.map(key => key.replace(this.prefix, ''))
    };
  }

  // Session storage methods (for temporary data)
  setSession<T>(key: string, data: T): boolean {
    try {
      const item: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        version: this.currentVersion
      };
      sessionStorage.setItem(this.prefix + key, JSON.stringify(item));
      return true;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        // logger.warn(`Failed to cache session item ${key}:`, error, LogCategory.UTILITY); // COMMENTED FOR PRODUCTION
      }
      return false;
    }
  }

  getSession<T>(key: string): T | null {
    try {
      const stored = sessionStorage.getItem(this.prefix + key);
      if (!stored) return null;

      const item: CacheItem<T> = JSON.parse(stored);
      return item.data;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        // logger.warn(`Failed to retrieve session item ${key}:`, error, LogCategory.UTILITY); // COMMENTED FOR PRODUCTION
      }
      sessionStorage.removeItem(this.prefix + key);
      return null;
    }
  }

  removeSession(key: string): void {
    sessionStorage.removeItem(this.prefix + key);
  }

  // Cache user progress and achievements
  cacheUserProgress(userId: string, progress: any): void {
    this.set(`user_progress_${userId}`, progress, {
      expiry: 7 * 24 * 60 * 60 * 1000, // 7 days
      compress: true
    });
  }

  getUserProgress(userId: string): any {
    return this.get(`user_progress_${userId}`);
  }

  // Cache learning content
  cacheLearningContent(contentId: string, content: any): void {
    this.set(`learning_content_${contentId}`, content, {
      expiry: 24 * 60 * 60 * 1000, // 24 hours
      compress: true
    });
  }

  getLearningContent(contentId: string): any {
    return this.get(`learning_content_${contentId}`);
  }

  // Cache images as base64 (for critical images only)
  async cacheImageAsBase64(url: string, maxSize: number = 100000): Promise<string | null> {
    try {
      const cached = this.get<string>(`image_${url}`);
      if (cached) return cached;

      const response = await fetch(url);
      const blob = await response.blob();
      
      // Only cache small images to avoid localStorage quota issues
      if (blob.size > maxSize) {
        if (process.env.NODE_ENV === 'development') {
          // logger.warn(`Image ${url} too large to cache (${blob.size} bytes)`, LogCategory.UTILITY); // COMMENTED FOR PRODUCTION
        }
        return null;
      }

      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          this.set(`image_${url}`, base64, {
            expiry: 30 * 24 * 60 * 60 * 1000, // 30 days
            compress: true
          });
          resolve(base64);
        };
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        // logger.warn(`Failed to cache image ${url}:`, error, LogCategory.UTILITY); // COMMENTED FOR PRODUCTION
      }
      return null;
    }
  }

  getCachedImage(url: string): string | null {
    return this.get<string>(`image_${url}`);
  }

  // Cleanup expired items
  cleanup(): void {
    const keys = Object.keys(localStorage).filter(key => key.startsWith(this.prefix));
    let cleanedCount = 0;

    keys.forEach(key => {
      try {
        const stored = localStorage.getItem(key);
        if (!stored) return;

        const item: CacheItem = JSON.parse(stored);
        
        // Remove expired items
        if (item.expiry && Date.now() > item.expiry) {
          localStorage.removeItem(key);
          cleanedCount++;
        }
        
        // Remove version mismatches
        else if (item.version && item.version !== this.currentVersion) {
          localStorage.removeItem(key);
          cleanedCount++;
        }
      } catch {
        // Remove corrupted items
        localStorage.removeItem(key);
        cleanedCount++;
      }
    });

    // Only log in development
    if (cleanedCount > 0 && process.env.NODE_ENV === 'development') {
      // logger.info(`🧹 Cleaned up ${cleanedCount} expired cache items`, LogCategory.UTILITY); // COMMENTED FOR PRODUCTION
    }
  }

  // Check if localStorage is available and has space
  isAvailable(): boolean {
    try {
      const test = 'cache_test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  // Get remaining storage space (approximate)
  getRemainingSpace(): number {
    if (!this.isAvailable()) return 0;

    try {
      const used = new Blob(Object.values(localStorage)).size;
      const limit = 5 * 1024 * 1024; // 5MB typical limit
      return Math.max(0, limit - used);
    } catch {
      return 0;
    }
  }
}

// Create singleton instance
export const cacheManager = new CacheManager();

// Initialize cache manager
export const initializeCache = (): void => {
  if (!cacheManager.isAvailable()) {
    if (process.env.NODE_ENV === 'development') {
      // logger.warn('⚠️ localStorage not available - caching disabled', LogCategory.UTILITY); // COMMENTED FOR PRODUCTION
    }
    return;
  }

  // Cleanup expired items on startup
  cacheManager.cleanup();

  // Log cache statistics only in development
  if (process.env.NODE_ENV === 'development') {
    const stats = cacheManager.getStats();
    // logger.info(`🗄️ Cache initialized: ${stats.count} items, ${(stats.size / 1024).toFixed(2)}KB`, LogCategory.UTILITY); // COMMENTED FOR PRODUCTION
  }

  // Set up periodic cleanup (every 30 minutes)
  setInterval(() => {
    cacheManager.cleanup();
  }, 30 * 60 * 1000);
};

export default CacheManager;
