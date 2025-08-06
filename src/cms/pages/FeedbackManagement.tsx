import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Star, 
  Eye, 
  Trash2, 
  Search, 
  RefreshCw,
  Calendar,
  User,
  Mail,
  CheckCircle,
  Clock,
  Download
} from 'lucide-react';
import { collection, getDocs, doc, deleteDoc, updateDoc, Timestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useCMSNotifications } from '../components/CMSNotification';
import { logger, LogCategory } from '../../utils/logger';

interface Feedback {
  id: string;
  message: string;
  rating: number;
  category: string;
  isAnonymous: boolean;
  name?: string;
  email?: string;
  userId?: string;
  submittedAt: Timestamp;
  status: 'new' | 'read' | 'resolved';
  source: string;
  userAgent?: string;
  timestamp: string;
}

const FeedbackManagement: React.FC = () => {
  const { addNotification } = useCMSNotifications();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadFeedbacks();
  }, []);

  useEffect(() => {
    filterFeedbacks();
  }, [feedbacks, selectedStatus, selectedCategory, searchTerm]);

  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      console.log('📥 Loading feedback from Firebase...');
      
      // Create query to get feedbacks ordered by submission date (newest first)
      const feedbackQuery = query(
        collection(db, 'feedback'),
        orderBy('submittedAt', 'desc')
      );
      
      const snapshot = await getDocs(feedbackQuery);
      const feedbacksData: Feedback[] = [];
      
      console.log(`📊 Found ${snapshot.size} feedback entries`);
      
      snapshot.forEach(doc => {
        const data = doc.data();
        console.log(`💬 Processing feedback: ${data.category} - ${data.rating} stars`);
        
        feedbacksData.push({
          id: doc.id,
          message: data.message || '',
          rating: data.rating || 5,
          category: data.category || 'general',
          isAnonymous: data.isAnonymous || false,
          name: data.name,
          email: data.email,
          userId: data.userId,
          submittedAt: data.submittedAt || Timestamp.now(),
          status: data.status || 'new',
          source: data.source || 'unknown',
          userAgent: data.userAgent,
          timestamp: data.timestamp || new Date().toISOString()
        });
      });
      
      setFeedbacks(feedbacksData);
      console.log(`✅ Loaded ${feedbacksData.length} feedback entries`);
      
    } catch (error) {
      console.error('❌ Error loading feedback:', error);
      logger.error(LogCategory.CMS, 'Error loading feedback', error);
      addNotification('error', 'Loading Failed', 'Failed to load feedback from database.');
    } finally {
      setLoading(false);
    }
  };

  const filterFeedbacks = () => {
    let filtered = [...feedbacks];

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(feedback => feedback.status === selectedStatus);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(feedback => feedback.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(feedback => 
        feedback.message.toLowerCase().includes(term) ||
        feedback.name?.toLowerCase().includes(term) ||
        feedback.email?.toLowerCase().includes(term) ||
        feedback.category.toLowerCase().includes(term)
      );
    }

    setFilteredFeedbacks(filtered);
  };

  const updateFeedbackStatus = async (feedbackId: string, newStatus: Feedback['status']) => {
    try {
      await updateDoc(doc(db, 'feedback', feedbackId), {
        status: newStatus,
        updatedAt: Timestamp.now()
      });

      // Update local state
      setFeedbacks(prev => prev.map(feedback => 
        feedback.id === feedbackId 
          ? { ...feedback, status: newStatus }
          : feedback
      ));

      addNotification('success', 'Status Updated', `Feedback marked as ${newStatus}.`);
    } catch (error) {
      console.error('Error updating feedback status:', error);
      addNotification('error', 'Update Failed', 'Failed to update feedback status.');
    }
  };

  const deleteFeedback = async (feedbackId: string) => {
    try {
      await deleteDoc(doc(db, 'feedback', feedbackId));
      
      // Update local state
      setFeedbacks(prev => prev.filter(feedback => feedback.id !== feedbackId));
      
      addNotification('success', 'Feedback Deleted', 'Feedback entry has been deleted.');
      setShowDetailModal(false);
      setSelectedFeedback(null);
    } catch (error) {
      console.error('Error deleting feedback:', error);
      addNotification('error', 'Delete Failed', 'Failed to delete feedback.');
    }
  };

  const exportFeedbacks = () => {
    const csvContent = [
      ['Date', 'Name', 'Email', 'Category', 'Rating', 'Status', 'Message'].join(','),
      ...filteredFeedbacks.map(feedback => [
        feedback.submittedAt.toDate().toLocaleDateString(),
        feedback.isAnonymous ? 'Anonymous' : (feedback.name || 'N/A'),
        feedback.isAnonymous ? 'Anonymous' : (feedback.email || 'N/A'),
        feedback.category,
        feedback.rating,
        feedback.status,
        `"${feedback.message.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codecase-feedback-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    addNotification('success', 'Export Complete', 'Feedback data exported successfully.');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'text-blue-400';
      case 'read': return 'text-yellow-400';
      case 'resolved': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };



  const getAverageRating = () => {
    if (feedbacks.length === 0) return 0;
    const total = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
    return (total / feedbacks.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white">Loading feedback...</div>
        </div>
      </div>
    );
  }



  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Feedback Management</h1>
            <p className="text-white/60">Monitor and respond to user feedback</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={loadFeedbacks}
            className="flex items-center space-x-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button
            onClick={exportFeedbacks}
            className="flex items-center space-x-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Feedback</p>
              <p className="text-2xl font-bold text-white">{feedbacks.length}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Average Rating</p>
              <p className="text-2xl font-bold text-white">{getAverageRating()}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">New Feedback</p>
              <p className="text-2xl font-bold text-white">
                {feedbacks.filter(f => f.status === 'new').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-blue-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Resolved</p>
              <p className="text-2xl font-bold text-white">
                {feedbacks.filter(f => f.status === 'resolved').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-white font-medium mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search feedback..."
                className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all" className="bg-slate-800 text-white">All Status</option>
              <option value="new" className="bg-slate-800 text-white">New</option>
              <option value="read" className="bg-slate-800 text-white">Read</option>
              <option value="resolved" className="bg-slate-800 text-white">Resolved</option>
            </select>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all" className="bg-slate-800 text-white">All Categories</option>
              <option value="general" className="bg-slate-800 text-white">General</option>
              <option value="bug" className="bg-slate-800 text-white">Bug Report</option>
              <option value="feature" className="bg-slate-800 text-white">Feature Request</option>
              <option value="course" className="bg-slate-800 text-white">Course Content</option>
              <option value="ui" className="bg-slate-800 text-white">User Interface</option>
              <option value="performance" className="bg-slate-800 text-white">Performance</option>
            </select>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Results</label>
            <div className="px-4 py-2 bg-slate-700/30 border border-slate-600/50 rounded-lg text-slate-300">
              {filteredFeedbacks.length} of {feedbacks.length}
            </div>
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden"
      >
        <div className="p-6 border-b border-slate-700/50">
          <h2 className="text-xl font-bold text-white">Feedback Entries ({filteredFeedbacks.length})</h2>
        </div>
        
        <div className="divide-y divide-slate-700/50">
          {filteredFeedbacks.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400">No feedback found matching your criteria.</p>
            </div>
          ) : (
            filteredFeedbacks.map((feedback) => (
              <div key={feedback.id} className="p-6 hover:bg-slate-700/20 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-400'
                            }`}
                          />
                        ))}
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(feedback.status)}`}>
                        {feedback.status.toUpperCase()}
                      </span>
                      <span className="px-2 py-1 bg-slate-600/50 text-slate-300 rounded text-xs">
                        {feedback.category}
                      </span>
                    </div>
                    
                    <p className="text-slate-300 mb-3 line-clamp-2">
                      {feedback.message}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-slate-400">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{feedback.isAnonymous ? 'Anonymous' : (feedback.name || 'Unknown')}</span>
                      </div>
                      {!feedback.isAnonymous && feedback.email && (
                        <div className="flex items-center space-x-1">
                          <Mail className="w-4 h-4" />
                          <span>{feedback.email}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{feedback.submittedAt.toDate().toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => {
                        setSelectedFeedback(feedback);
                        setShowDetailModal(true);
                        if (feedback.status === 'new') {
                          updateFeedbackStatus(feedback.id, 'read');
                        }
                      }}
                      className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedFeedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 rounded-xl border border-slate-700 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Feedback Details</h2>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedFeedback(null);
                  }}
                  className="text-white/60 hover:text-white"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Rating and Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < selectedFeedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-400'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-white font-medium">{selectedFeedback.rating}/5</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      value={selectedFeedback.status}
                      onChange={(e) => updateFeedbackStatus(selectedFeedback.id, e.target.value as Feedback['status'])}
                      className="px-3 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                    >
                      <option value="new" className="bg-slate-800 text-white">New</option>
                      <option value="read" className="bg-slate-800 text-white">Read</option>
                      <option value="resolved" className="bg-slate-800 text-white">Resolved</option>
                    </select>
                  </div>
                </div>

                {/* User Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 text-sm mb-1">Name</label>
                    <p className="text-white">{selectedFeedback.isAnonymous ? 'Anonymous' : (selectedFeedback.name || 'Not provided')}</p>
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-1">Email</label>
                    <p className="text-white">{selectedFeedback.isAnonymous ? 'Anonymous' : (selectedFeedback.email || 'Not provided')}</p>
                  </div>
                </div>

                {/* Category and Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 text-sm mb-1">Category</label>
                    <p className="text-white capitalize">{selectedFeedback.category}</p>
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-1">Submitted</label>
                    <p className="text-white">{selectedFeedback.submittedAt.toDate().toLocaleString()}</p>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Message</label>
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <p className="text-white whitespace-pre-wrap">{selectedFeedback.message}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-700">
                  <button
                    onClick={() => deleteFeedback(selectedFeedback.id)}
                    className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeedbackManagement;
