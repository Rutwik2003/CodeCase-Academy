import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Download, 
  Trash2, 
  Filter, 
  Search, 
  AlertTriangle,
  Info,
  AlertCircle,
  Bug,
  RefreshCw,
  Calendar,
  User,
  Monitor,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react';
import { logger, LogEntry, LogLevel, LogCategory } from '../../utils/logger';
import { useCMSNotifications } from '../components/CMSNotification';

const LoggingManagement: React.FC = () => {
  const { addNotification } = useCMSNotifications();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<LogLevel | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<LogCategory | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [showDetails, setShowDetails] = useState<string | null>(null);

  // Load logs on component mount
  useEffect(() => {
    loadLogs();
  }, []);

  // Auto-refresh logs
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(loadLogs, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Filter logs when criteria change
  useEffect(() => {
    filterLogs();
  }, [logs, selectedLevel, selectedCategory, searchTerm, dateRange]);

  const loadLogs = () => {
    const allLogs = logger.getLogs();
    setLogs(allLogs);
  };

  const filterLogs = () => {
    let filtered = [...logs];

    // Filter by level
    if (selectedLevel !== 'ALL') {
      filtered = filtered.filter(log => log.level === selectedLevel);
    }

    // Filter by category
    if (selectedCategory !== 'ALL') {
      filtered = filtered.filter(log => log.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(term) ||
        log.category.toLowerCase().includes(term) ||
        log.userId?.toLowerCase().includes(term)
      );
    }

    // Filter by date range
    if (dateRange.start) {
      const startDate = new Date(dateRange.start);
      filtered = filtered.filter(log => log.timestamp >= startDate);
    }
    if (dateRange.end) {
      const endDate = new Date(dateRange.end + 'T23:59:59');
      filtered = filtered.filter(log => log.timestamp <= endDate);
    }

    setFilteredLogs(filtered);
  };

  const getLevelIcon = (level: LogLevel) => {
    switch (level) {
      case LogLevel.DEBUG:
        return <Bug className="w-4 h-4 text-blue-400" />;
      case LogLevel.INFO:
        return <Info className="w-4 h-4 text-green-400" />;
      case LogLevel.WARN:
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case LogLevel.ERROR:
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case LogLevel.CRITICAL:
        return <Shield className="w-4 h-4 text-red-600" />;
      default:
        return <Info className="w-4 h-4 text-gray-400" />;
    }
  };

  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case LogLevel.DEBUG:
        return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
      case LogLevel.INFO:
        return 'bg-green-500/10 border-green-500/20 text-green-400';
      case LogLevel.WARN:
        return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400';
      case LogLevel.ERROR:
        return 'bg-red-500/10 border-red-500/20 text-red-400';
      case LogLevel.CRITICAL:
        return 'bg-red-600/20 border-red-600/30 text-red-300';
      default:
        return 'bg-gray-500/10 border-gray-500/20 text-gray-400';
    }
  };

  const handleExportLogs = (format: 'json' | 'csv') => {
    try {
      const exportData = logger.exportLogs(format);
      const blob = new Blob([exportData], { 
        type: format === 'json' ? 'application/json' : 'text/csv' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `codecase-logs-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      addNotification('success', 'Export Complete', `Logs exported as ${format.toUpperCase()}`);
    } catch (error) {
      addNotification('error', 'Export Failed', 'Failed to export logs');
    }
  };

  const handleClearLogs = () => {
    addNotification('warning', 'Confirm Clear Logs', 'Are you sure you want to clear all logs?', {
      duration: 0,
      actions: [
        {
          label: 'Clear',
          onClick: () => {
            logger.clearLogs();
            loadLogs();
            addNotification('success', 'Logs Cleared', 'All logs have been cleared');
          },
          variant: 'primary'
        },
        {
          label: 'Cancel',
          onClick: () => {},
          variant: 'secondary'
        }
      ]
    });
  };

  const stats = logger.getLogStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">System Logging</h1>
            <p className="text-white/60">Monitor application logs and system events</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              autoRefresh 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-slate-700 text-white hover:bg-slate-600'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            <span>{autoRefresh ? 'Auto-refresh On' : 'Auto-refresh Off'}</span>
          </button>
          
          <button
            onClick={() => handleExportLogs('json')}
            className="flex items-center space-x-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 px-3 py-2 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON</span>
          </button>
          
          <button
            onClick={() => handleExportLogs('csv')}
            className="flex items-center space-x-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 px-3 py-2 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          
          <button
            onClick={handleClearLogs}
            className="flex items-center space-x-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 px-3 py-2 rounded-lg transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Logs</span>
          </button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4"
        >
          <div className="flex items-center space-x-3">
            <Activity className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-sm text-white/60">Total Logs</div>
              <div className="text-2xl font-bold text-white">{stats.total}</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4"
        >
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <div>
              <div className="text-sm text-white/60">Recent Errors</div>
              <div className="text-2xl font-bold text-white">{stats.recentErrors}</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4"
        >
          <div className="flex items-center space-x-3">
            <Info className="w-5 h-5 text-green-400" />
            <div>
              <div className="text-sm text-white/60">Info</div>
              <div className="text-2xl font-bold text-white">{stats.byLevel['INFO'] || 0}</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4"
        >
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <div>
              <div className="text-sm text-white/60">Warnings</div>
              <div className="text-2xl font-bold text-white">{stats.byLevel['WARN'] || 0}</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4"
        >
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-red-600" />
            <div>
              <div className="text-sm text-white/60">Critical</div>
              <div className="text-2xl font-bold text-white">{stats.byLevel['CRITICAL'] || 0}</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Filter className="w-5 h-5 text-white/60" />
          <h2 className="text-lg font-semibold text-white">Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-white/60 text-sm mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search logs..."
                className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-3 py-2 text-white placeholder-white/60"
              />
            </div>
          </div>

          {/* Level Filter */}
          <div>
            <label className="block text-white/60 text-sm mb-2">Log Level</label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as LogLevel | 'ALL')}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
            >
              <option value="ALL" className="bg-slate-800 text-white">All Levels</option>
              <option value={LogLevel.DEBUG} className="bg-slate-800 text-white">Debug</option>
              <option value={LogLevel.INFO} className="bg-slate-800 text-white">Info</option>
              <option value={LogLevel.WARN} className="bg-slate-800 text-white">Warning</option>
              <option value={LogLevel.ERROR} className="bg-slate-800 text-white">Error</option>
              <option value={LogLevel.CRITICAL} className="bg-slate-800 text-white">Critical</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-white/60 text-sm mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as LogCategory | 'ALL')}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
            >
              <option value="ALL" className="bg-slate-800 text-white">All Categories</option>
              {Object.values(LogCategory).map(category => (
                <option key={category} value={category} className="bg-slate-800 text-white">{category}</option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-white/60 text-sm mb-2">Date Range</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="bg-slate-700 border border-slate-600 rounded-lg px-2 py-2 text-white text-xs"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="bg-slate-700 border border-slate-600 rounded-lg px-2 py-2 text-white text-xs"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Logs Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden"
      >
        <div className="p-6 border-b border-slate-700/50">
          <h2 className="text-xl font-bold text-white">
            System Logs ({filteredLogs.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/30">
              <tr>
                <th className="text-left p-4 text-white/80 font-medium">Timestamp</th>
                <th className="text-left p-4 text-white/80 font-medium">Level</th>
                <th className="text-left p-4 text-white/80 font-medium">Category</th>
                <th className="text-left p-4 text-white/80 font-medium">Message</th>
                <th className="text-left p-4 text-white/80 font-medium">User</th>
                <th className="text-left p-4 text-white/80 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-700/20 transition-colors">
                  <td className="p-4 text-white/80 text-sm">
                    {log.timestamp.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <div className={`inline-flex items-center space-x-2 px-2 py-1 rounded border ${getLevelColor(log.level)}`}>
                      {getLevelIcon(log.level)}
                      <span className="text-xs font-medium">{LogLevel[log.level]}</span>
                    </div>
                  </td>
                  <td className="p-4 text-white/80 text-sm">{log.category}</td>
                  <td className="p-4 text-white/80 text-sm max-w-md truncate">{log.message}</td>
                  <td className="p-4 text-white/60 text-sm">
                    {log.userId ? (
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{log.userId.substring(0, 8)}...</span>
                      </div>
                    ) : (
                      'System'
                    )}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => setShowDetails(showDetails === log.id ? null : log.id)}
                      className="p-1 hover:bg-slate-600/50 rounded"
                      title="Toggle Details"
                    >
                      {showDetails === log.id ? (
                        <EyeOff className="w-4 h-4 text-white/60" />
                      ) : (
                        <Eye className="w-4 h-4 text-white/60" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLogs.length === 0 && (
            <div className="p-8 text-center text-white/60">
              <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No logs match the current filters</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Log Details Modal */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-800 rounded-xl border border-slate-700 p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            {(() => {
              const log = filteredLogs.find(l => l.id === showDetails);
              if (!log) return null;

              return (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Log Details</h2>
                    <button
                      onClick={() => setShowDetails(null)}
                      className="text-white/60 hover:text-white"
                    >
                      ×
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white/60 text-sm mb-1">Timestamp</label>
                        <div className="text-white">{log.timestamp.toLocaleString()}</div>
                      </div>
                      <div>
                        <label className="block text-white/60 text-sm mb-1">Level</label>
                        <div className={`inline-flex items-center space-x-2 px-2 py-1 rounded border ${getLevelColor(log.level)}`}>
                          {getLevelIcon(log.level)}
                          <span className="text-xs font-medium">{LogLevel[log.level]}</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-white/60 text-sm mb-1">Category</label>
                        <div className="text-white">{log.category}</div>
                      </div>
                      <div>
                        <label className="block text-white/60 text-sm mb-1">Session ID</label>
                        <div className="text-white/80 text-sm font-mono">{log.sessionId}</div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-white/60 text-sm mb-1">Message</label>
                      <div className="bg-slate-700/50 rounded-lg p-3 text-white">{log.message}</div>
                    </div>

                    {log.details && (
                      <div>
                        <label className="block text-white/60 text-sm mb-1">Details</label>
                        <pre className="bg-slate-700/50 rounded-lg p-3 text-white text-sm overflow-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </div>
                    )}

                    {log.stackTrace && (
                      <div>
                        <label className="block text-white/60 text-sm mb-1">Stack Trace</label>
                        <pre className="bg-slate-700/50 rounded-lg p-3 text-white text-xs overflow-auto">
                          {log.stackTrace}
                        </pre>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="block text-white/60 text-sm mb-1">User Agent</label>
                        <div className="text-white/80 text-xs">{log.userAgent}</div>
                      </div>
                      <div>
                        <label className="block text-white/60 text-sm mb-1">URL</label>
                        <div className="text-white/80 text-xs break-all">{log.url}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default LoggingManagement;
