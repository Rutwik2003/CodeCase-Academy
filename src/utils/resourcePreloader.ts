// Resource Preloader for Critical Assets
interface PreloadResource {
  url: string;
  type: 'image' | 'font' | 'script' | 'style';
  priority?: 'high' | 'low';
}

class ResourcePreloader {
  private cache = new Map<string, Promise<any>>();
  private loadedResources = new Set<string>();

  // Critical resources that should load immediately
  private criticalResources: PreloadResource[] = [
    { url: '/assets/favicon.ico', type: 'image', priority: 'high' },
    // Add your critical images here
    { url: '/assets/hint_guy.jpeg', type: 'image', priority: 'high' },
    { url: '/assets/police_guy.jpeg', type: 'image', priority: 'high' },
  ];

  // Non-critical resources that can load in background
  private backgroundResources: PreloadResource[] = [
    { url: '/assets/confession_note.png.png', type: 'image', priority: 'low' },
    { url: '/assets/laptop_closeup.png.png', type: 'image', priority: 'low' },
    { url: '/assets/phone_closeup.png.png', type: 'image', priority: 'low' },
    { url: '/assets/notebook.png', type: 'image', priority: 'low' },
    { url: '/assets/desktop_file.png', type: 'image', priority: 'low' },
    { url: '/assets/rishi_embarrassed.png', type: 'image', priority: 'low' },
    { url: '/assets/rishi_room.png', type: 'image', priority: 'low' },
    { url: '/assets/subordinate_detective.jpeg', type: 'image', priority: 'low' },
  ];

  async preloadImage(url: string): Promise<HTMLImageElement> {
    if (this.cache.has(url)) {
      return this.cache.get(url)!;
    }

    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.loadedResources.add(url);
        resolve(img);
      };
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    });

    this.cache.set(url, promise);
    return promise;
  }

  async preloadFont(url: string): Promise<FontFace> {
    if (this.cache.has(url)) {
      return this.cache.get(url)!;
    }

    const promise = new Promise<FontFace>((resolve, reject) => {
      const font = new FontFace('preloaded-font', `url(${url})`);
      font.load().then(() => {
        document.fonts.add(font);
        this.loadedResources.add(url);
        resolve(font);
      }).catch(reject);
    });

    this.cache.set(url, promise);
    return promise;
  }

  async preloadScript(url: string): Promise<void> {
    if (this.cache.has(url)) {
      return this.cache.get(url)!;
    }

    const promise = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.onload = () => {
        this.loadedResources.add(url);
        resolve();
      };
      script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
      script.src = url;
      document.head.appendChild(script);
    });

    this.cache.set(url, promise);
    return promise;
  }

  async preloadStyle(url: string): Promise<void> {
    if (this.cache.has(url)) {
      return this.cache.get(url)!;
    }

    const promise = new Promise<void>((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.onload = () => {
        this.loadedResources.add(url);
        resolve();
      };
      link.onerror = () => reject(new Error(`Failed to load stylesheet: ${url}`));
      link.href = url;
      document.head.appendChild(link);
    });

    this.cache.set(url, promise);
    return promise;
  }

  async preloadResource(resource: PreloadResource): Promise<any> {
    switch (resource.type) {
      case 'image':
        return this.preloadImage(resource.url);
      case 'font':
        return this.preloadFont(resource.url);
      case 'script':
        return this.preloadScript(resource.url);
      case 'style':
        return this.preloadStyle(resource.url);
      default:
        throw new Error(`Unknown resource type: ${resource.type}`);
    }
  }

  async preloadCriticalResources(): Promise<void> {
    const promises = this.criticalResources.map(resource => 
      this.preloadResource(resource).catch(err => {
        if (process.env.NODE_ENV === 'development') {
          // logger.warn(`Failed to preload critical resource ${resource.url}:`, err, LogCategory.UTILITY); // COMMENTED FOR PRODUCTION
        }
      })
    );

    await Promise.allSettled(promises);
  }

  preloadBackgroundResources(): void {
    // Use requestIdleCallback for non-critical resources
    const preloadInIdle = () => {
      this.backgroundResources.forEach(resource => {
        this.preloadResource(resource).catch(err => {
          if (process.env.NODE_ENV === 'development') {
            // logger.warn(`Failed to preload background resource ${resource.url}:`, err, LogCategory.UTILITY); // COMMENTED FOR PRODUCTION
          }
        });
      });
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(preloadInIdle, { timeout: 5000 });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(preloadInIdle, 100);
    }
  }

  isResourceLoaded(url: string): boolean {
    return this.loadedResources.has(url);
  }

  getLoadedResourcesCount(): number {
    return this.loadedResources.size;
  }

  getTotalResourcesCount(): number {
    return this.criticalResources.length + this.backgroundResources.length;
  }

  getLoadProgress(): number {
    const total = this.getTotalResourcesCount();
    const loaded = this.getLoadedResourcesCount();
    return total > 0 ? (loaded / total) * 100 : 0;
  }

  // Clear cache (useful for testing or memory management)
  clearCache(): void {
    this.cache.clear();
    this.loadedResources.clear();
  }
}

// Create singleton instance
export const resourcePreloader = new ResourcePreloader();

// Initialize preloading when module loads
export const initializePreloader = async (): Promise<void> => {
  try {
    // Preload critical resources first
    await resourcePreloader.preloadCriticalResources();
    
    // Then start background preloading
    resourcePreloader.preloadBackgroundResources();
    
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      // logger.info('🕵️‍♂️ Detective Academy resources preloaded successfully!', LogCategory.UTILITY); // COMMENTED FOR PRODUCTION
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // logger.error('❌ Failed to initialize resource preloader:', error, LogCategory.UTILITY); // COMMENTED FOR PRODUCTION
    }
  }
};

export default ResourcePreloader;
