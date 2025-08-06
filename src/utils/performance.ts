// Performance monitoring and optimization utilities

// Lazy loading utility for images
export const lazyLoadImage = (src: string, placeholder?: string) => {
  return new Promise<string>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => resolve(placeholder || '/images/placeholder.png');
    img.src = src;
  });
};

// Debounce utility for search and input fields
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility for scroll events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Performance observer for measuring page load times
export const measurePageLoad = () => {
  if ('performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        const metrics = {
          dns: perfData.domainLookupEnd - perfData.domainLookupStart,
          tcp: perfData.connectEnd - perfData.connectStart,
          ssl: perfData.connectEnd - perfData.secureConnectionStart,
          ttfb: perfData.responseStart - perfData.requestStart,
          download: perfData.responseEnd - perfData.responseStart,
          dom: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
          total: perfData.loadEventEnd - perfData.fetchStart
        };

        // logger.info('Performance Metrics:', metrics, LogCategory.UTILITY); // COMMENTED FOR PRODUCTION
        
        // Send to analytics if needed
        if (window.gtag) {
          window.gtag('event', 'page_load_time', {
            event_category: 'performance',
            event_label: 'total_load_time',
            value: Math.round(metrics.total)
          });
        }
      }, 0);
    });
  }
};

// Intersection Observer for lazy loading components
export const createIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };

  return new IntersectionObserver(callback, defaultOptions);
};

// Preload critical resources
export const preloadResource = (href: string, as: string, type?: string) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (type) link.type = type;
  document.head.appendChild(link);
};

// Service Worker registration for caching
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      // logger.info('SW registered: ', registration, LogCategory.UTILITY); // COMMENTED FOR PRODUCTION
      return registration;
    } catch (registrationError) {
      // logger.info('SW registration failed: ', registrationError, LogCategory.UTILITY); // COMMENTED FOR PRODUCTION
    }
  }
};

// Web Vitals measurement
export const measureWebVitals = () => {
  // This would typically use the web-vitals library
  // For now, we'll use basic performance API
  
  if ('performance' in window) {
    // Measure Largest Contentful Paint (LCP)
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      if (window.gtag) {
        window.gtag('event', 'largest_contentful_paint', {
          event_category: 'web_vitals',
          value: Math.round(lastEntry.startTime)
        });
      }
    });
    
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
    
    // Measure First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (window.gtag) {
          window.gtag('event', 'first_input_delay', {
            event_category: 'web_vitals',
            value: Math.round((entry as any).processingStart - entry.startTime)
          });
        }
      }
    });
    
    fidObserver.observe({ entryTypes: ['first-input'] });
  }
};

// Memory usage monitoring
export const monitorMemoryUsage = () => {
  if ('memory' in performance) {
    const memInfo = (performance as any).memory;
    
    const usage = {
      used: Math.round(memInfo.usedJSHeapSize / 1048576), // MB
      total: Math.round(memInfo.totalJSHeapSize / 1048576), // MB
      limit: Math.round(memInfo.jsHeapSizeLimit / 1048576) // MB
    };
    
    // logger.info('Memory Usage:', usage, LogCategory.UTILITY); // COMMENTED FOR PRODUCTION
    
    // Alert if memory usage is high
    if (usage.used / usage.limit > 0.8) {
      // logger.warn('High memory usage detected', LogCategory.UTILITY); // COMMENTED FOR PRODUCTION
    }
    
    return usage;
  }
};

// Initialize all performance monitoring
export const initializePerformanceMonitoring = () => {
  measurePageLoad();
  measureWebVitals();
  
  // Monitor memory every 30 seconds
  setInterval(monitorMemoryUsage, 30000);
};
