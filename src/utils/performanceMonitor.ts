// Performance Monitor for Detective Academy
import { logger, LogCategory } from './logger';

interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToInteractive: number;
  resourceCount: number;
  cacheHitRate: number;
}

class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];
  private startTime = performance.now();

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers(): void {
    try {
      // Observe Core Web Vitals
      if ('PerformanceObserver' in window) {
        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          this.metrics.largestContentfulPaint = lastEntry.startTime;
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);

        // First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            this.metrics.firstInputDelay = entry.processingStart - entry.startTime;
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);

        // Cumulative Layout Shift
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          let clsValue = 0;
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          this.metrics.cumulativeLayoutShift = clsValue;
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        // logger.warn('Performance Observer not supported:', error, LogCategory.UTILITY); // COMMENTED FOR PRODUCTION
      }
    }
  }

  // Measure page load performance
  measurePageLoad(): void {
    if ('performance' in window && 'timing' in performance) {
      const timing = performance.timing;

      this.metrics.loadTime = timing.loadEventEnd - timing.navigationStart;
      this.metrics.timeToInteractive = timing.domInteractive - timing.navigationStart;
      
      // Get First Contentful Paint
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        this.metrics.firstContentfulPaint = fcpEntry.startTime;
      }
    }
  }

  // Measure resource loading performance
  measureResources(): void {
    const resourceEntries = performance.getEntriesByType('resource');
    this.metrics.resourceCount = resourceEntries.length;

    // Log slow resources (> 1 second) only in development
    const slowResources = resourceEntries.filter(entry => entry.duration > 1000);
    if (slowResources.length > 0 && process.env.NODE_ENV === 'development') {
      // logger.warn('🐌 Slow loading resources:', slowResources.map(r => ({ // COMMENTED FOR PRODUCTION
      //   name: r.name,
      //   duration: Math.round(r.duration)
      // })), LogCategory.UTILITY);
    }
  }

  // Calculate cache hit rate
  calculateCacheHitRate(): number {
    const resourceEntries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    if (resourceEntries.length === 0) return 0;

    const cachedResources = resourceEntries.filter(entry => 
      entry.transferSize === 0 || entry.transferSize < entry.encodedBodySize
    );

    const hitRate = (cachedResources.length / resourceEntries.length) * 100;
    this.metrics.cacheHitRate = hitRate;
    return hitRate;
  }

  // Get performance score (0-100)
  getPerformanceScore(): number {
    let score = 100;

    // Deduct points for poor metrics
    if (this.metrics.firstContentfulPaint && this.metrics.firstContentfulPaint > 2000) {
      score -= 10;
    }
    if (this.metrics.largestContentfulPaint && this.metrics.largestContentfulPaint > 2500) {
      score -= 15;
    }
    if (this.metrics.firstInputDelay && this.metrics.firstInputDelay > 100) {
      score -= 10;
    }
    if (this.metrics.cumulativeLayoutShift && this.metrics.cumulativeLayoutShift > 0.1) {
      score -= 15;
    }
    if (this.metrics.loadTime && this.metrics.loadTime > 3000) {
      score -= 20;
    }

    // Bonus for good cache hit rate
    if (this.metrics.cacheHitRate && this.metrics.cacheHitRate > 80) {
      score += 10;
    }

    return Math.max(0, Math.min(100, score));
  }

  // Generate performance report
  generateReport(): PerformanceMetrics & { score: number } {
    this.measurePageLoad();
    this.measureResources();
    this.calculateCacheHitRate();

    const report = {
      ...this.metrics,
      score: this.getPerformanceScore()
    } as PerformanceMetrics & { score: number };

    // Log performance summary (only in development)
    if (process.env.NODE_ENV === 'development') {
      logger.info(LogCategory.PERFORMANCE, '🕵️‍♂️ Detective Academy Performance Report');
      logger.info(LogCategory.PERFORMANCE, `Overall Score: ${report.score}/100`);
      logger.info(LogCategory.PERFORMANCE, `Load Time: ${report.loadTime || 0}ms`);
      logger.info(LogCategory.PERFORMANCE, `First Contentful Paint: ${report.firstContentfulPaint || 0}ms`);
      logger.info(LogCategory.PERFORMANCE, `Largest Contentful Paint: ${report.largestContentfulPaint || 0}ms`);
      logger.info(LogCategory.PERFORMANCE, `Cache Hit Rate: ${report.cacheHitRate || 0}%`);
      logger.info(LogCategory.PERFORMANCE, `Resource Count: ${report.resourceCount || 0}`);
      
      if (report.score >= 90) {
        logger.info(LogCategory.PERFORMANCE, '🏆 Excellent performance! Detective work at its finest!');
      } else if (report.score >= 70) {
        logger.info(LogCategory.PERFORMANCE, '👍 Good performance! Room for optimization.');
      } else {
        logger.warn(LogCategory.PERFORMANCE, '⚠️ Performance needs investigation. Consider optimizations.');
      }
    }

    return report;
  }

  // Monitor memory usage
  getMemoryUsage(): any {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1048576), // MB
        total: Math.round(memory.totalJSHeapSize / 1048576), // MB
        limit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
      };
    }
    return null;
  }

  // Start monitoring session
  startSession(): void {
    const sessionStart = performance.now();
    this.startTime = sessionStart;
    
    // Monitor performance after page loads
    if (document.readyState === 'complete') {
      setTimeout(() => this.generateReport(), 1000);
    } else {
      window.addEventListener('load', () => {
        setTimeout(() => this.generateReport(), 1000);
      });
    }
  }

  // Clean up observers
  dispose(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Auto-start monitoring
export const initializePerformanceMonitoring = (): void => {
  performanceMonitor.startSession();
  
  // Monitor memory usage every 30 seconds in development
  if (process.env.NODE_ENV === 'development') {
    setInterval(() => {
      const memory = performanceMonitor.getMemoryUsage();
      if (memory && memory.used > memory.limit * 0.8) {
        // logger.warn(`⚠️ High memory usage: ${memory.used}MB / ${memory.limit}MB`, LogCategory.UTILITY); // COMMENTED FOR PRODUCTION
      }
    }, 30000);
  }
};

export default PerformanceMonitor;
