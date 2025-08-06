// Professional logging system for CodeCase Detective Academy
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4
}

export enum LogCategory {
  AUTH = 'AUTH',
  CMS = 'CMS',
  FIREBASE = 'FIREBASE',
  PERFORMANCE = 'PERFORMANCE',
  USER_ACTION = 'USER_ACTION',
  CASE_SYSTEM = 'CASE_SYSTEM',
  VALIDATION = 'VALIDATION',
  TOUR = 'TOUR',
  ADMIN = 'ADMIN',
  UNLOCK = 'UNLOCK',
  REFERRAL = 'REFERRAL',
  DAILY_LOGIN = 'DAILY_LOGIN',
  PROFILE = 'PROFILE',
  SYSTEM = 'SYSTEM'
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  category: LogCategory;
  message: string;
  details?: any;
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  url?: string;
  stackTrace?: string;
  metadata?: Record<string, any>;
}

class Logger {
  private logs: LogEntry[] = [];
  private sessionId: string;
  private maxLogs: number = 1000;
  private enabledLevels: Set<LogLevel>;
  private enabledCategories: Set<LogCategory>;

  constructor() {
    this.sessionId = this.generateSessionId();
    
    // Default configuration - only show important logs in production
    this.enabledLevels = new Set([
      LogLevel.WARN,
      LogLevel.ERROR,
      LogLevel.CRITICAL
    ]);
    
    this.enabledCategories = new Set(Object.values(LogCategory));
    
    // Enable more logging in development
    if (process.env.NODE_ENV === 'development') {
      this.enabledLevels.add(LogLevel.INFO);
      this.enabledLevels.add(LogLevel.DEBUG);
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private createLogEntry(
    level: LogLevel,
    category: LogCategory,
    message: string,
    details?: any,
    userId?: string
  ): LogEntry {
    const entry: LogEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      level,
      category,
      message,
      details,
      userId,
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Add stack trace for errors
    if (level >= LogLevel.ERROR) {
      entry.stackTrace = new Error().stack;
    }

    return entry;
  }

  private shouldLog(level: LogLevel, category: LogCategory): boolean {
    return this.enabledLevels.has(level) && this.enabledCategories.has(category);
  }

  private addLog(entry: LogEntry): void {
    this.logs.push(entry);
    
    // Maintain max logs limit
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  // Main logging methods
  debug(category: LogCategory, message: string, details?: any, userId?: string): void {
    if (!this.shouldLog(LogLevel.DEBUG, category)) return;
    const entry = this.createLogEntry(LogLevel.DEBUG, category, message, details, userId);
    this.addLog(entry);
  }

  info(category: LogCategory, message: string, details?: any, userId?: string): void {
    if (!this.shouldLog(LogLevel.INFO, category)) return;
    const entry = this.createLogEntry(LogLevel.INFO, category, message, details, userId);
    this.addLog(entry);
  }

  warn(category: LogCategory, message: string, details?: any, userId?: string): void {
    if (!this.shouldLog(LogLevel.WARN, category)) return;
    const entry = this.createLogEntry(LogLevel.WARN, category, message, details, userId);
    this.addLog(entry);
  }

  error(category: LogCategory, message: string, details?: any, userId?: string): void {
    if (!this.shouldLog(LogLevel.ERROR, category)) return;
    const entry = this.createLogEntry(LogLevel.ERROR, category, message, details, userId);
    this.addLog(entry);
  }

  critical(category: LogCategory, message: string, details?: any, userId?: string): void {
    if (!this.shouldLog(LogLevel.CRITICAL, category)) return;
    const entry = this.createLogEntry(LogLevel.CRITICAL, category, message, details, userId);
    this.addLog(entry);
    
    // Critical logs should also be sent to external monitoring if configured
    this.sendToCriticalMonitoring(entry);
  }

  // Specialized logging methods for common scenarios
  authEvent(message: string, details?: any, userId?: string): void {
    this.info(LogCategory.AUTH, message, details, userId);
  }

  userAction(message: string, details?: any, userId?: string): void {
    this.info(LogCategory.USER_ACTION, message, details, userId);
  }

  firebaseError(message: string, error: any, userId?: string): void {
    this.error(LogCategory.FIREBASE, message, { 
      error: error?.message || error,
      code: error?.code,
      stack: error?.stack 
    }, userId);
  }

  performanceWarning(message: string, metrics: any): void {
    this.warn(LogCategory.PERFORMANCE, message, metrics);
  }

  caseProgress(message: string, caseId: string, details?: any, userId?: string): void {
    this.info(LogCategory.CASE_SYSTEM, message, { caseId, ...details }, userId);
  }

  adminAction(message: string, details?: any, adminId?: string): void {
    this.info(LogCategory.ADMIN, message, details, adminId);
  }

  // Configuration methods
  setLogLevel(level: LogLevel): void {
    this.enabledLevels.clear();
    for (let i = level; i <= LogLevel.CRITICAL; i++) {
      this.enabledLevels.add(i);
    }
  }

  enableCategory(category: LogCategory): void {
    this.enabledCategories.add(category);
  }

  disableCategory(category: LogCategory): void {
    this.enabledCategories.delete(category);
  }

  // Log retrieval and management
  getLogs(
    level?: LogLevel,
    category?: LogCategory,
    startTime?: Date,
    endTime?: Date,
    limit?: number
  ): LogEntry[] {
    let filtered = this.logs;

    if (level !== undefined) {
      filtered = filtered.filter(log => log.level >= level);
    }

    if (category) {
      filtered = filtered.filter(log => log.category === category);
    }

    if (startTime) {
      filtered = filtered.filter(log => log.timestamp >= startTime);
    }

    if (endTime) {
      filtered = filtered.filter(log => log.timestamp <= endTime);
    }

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    if (limit) {
      filtered = filtered.slice(0, limit);
    }

    return filtered;
  }

  getLogsByUser(userId: string, limit?: number): LogEntry[] {
    const userLogs = this.logs.filter(log => log.userId === userId);
    return userLogs.slice(0, limit || 100);
  }

  clearLogs(): void {
    this.logs = [];
  }

  getLogStats(): {
    total: number;
    byLevel: Record<string, number>;
    byCategory: Record<string, number>;
    recentErrors: number;
  } {
    const stats = {
      total: this.logs.length,
      byLevel: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
      recentErrors: 0
    };

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    this.logs.forEach(log => {
      // Count by level
      const levelName = LogLevel[log.level];
      stats.byLevel[levelName] = (stats.byLevel[levelName] || 0) + 1;

      // Count by category
      stats.byCategory[log.category] = (stats.byCategory[log.category] || 0) + 1;

      // Count recent errors
      if (log.level >= LogLevel.ERROR && log.timestamp >= oneHourAgo) {
        stats.recentErrors++;
      }
    });

    return stats;
  }

  // Export logs for analysis
  exportLogs(format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      const headers = ['Timestamp', 'Level', 'Category', 'Message', 'UserId', 'Details'];
      const csvRows = [
        headers.join(','),
        ...this.logs.map(log => [
          log.timestamp.toISOString(),
          LogLevel[log.level],
          log.category,
          `"${log.message.replace(/"/g, '""')}"`,
          log.userId || '',
          `"${JSON.stringify(log.details || {}).replace(/"/g, '""')}"`
        ].join(','))
      ];
      return csvRows.join('\n');
    }

    return JSON.stringify(this.logs, null, 2);
  }

  private sendToCriticalMonitoring(entry: LogEntry): void {
    // In a real application, this would send to external monitoring services
    // like Sentry, DataDog, New Relic, etc.
    if (process.env.NODE_ENV === 'development') {
      logger.error(LogCategory.SYSTEM, '🚨 CRITICAL LOG:', entry);
    }
  }
}

// Create singleton logger instance
export const logger = new Logger();

// Convenience functions for quick logging
export const log = {
  debug: (category: LogCategory, message: string, details?: any, userId?: string) => 
    logger.debug(category, message, details, userId),
  
  info: (category: LogCategory, message: string, details?: any, userId?: string) => 
    logger.info(category, message, details, userId),
  
  warn: (category: LogCategory, message: string, details?: any, userId?: string) => 
    logger.warn(category, message, details, userId),
  
  error: (category: LogCategory, message: string, details?: any, userId?: string) => 
    logger.error(category, message, details, userId),
  
  critical: (category: LogCategory, message: string, details?: any, userId?: string) => 
    logger.critical(category, message, details, userId),

  // Specialized shortcuts
  auth: (message: string, details?: any, userId?: string) => 
    logger.authEvent(message, details, userId),
  
  userAction: (message: string, details?: any, userId?: string) => 
    logger.userAction(message, details, userId),
  
  firebaseError: (message: string, error: any, userId?: string) => 
    logger.firebaseError(message, error, userId),
  
  performance: (message: string, metrics: any) => 
    logger.performanceWarning(message, metrics),
  
  caseProgress: (message: string, caseId: string, details?: any, userId?: string) => 
    logger.caseProgress(message, caseId, details, userId),
  
  adminAction: (message: string, details?: any, adminId?: string) => 
    logger.adminAction(message, details, adminId)
};

export default logger;
