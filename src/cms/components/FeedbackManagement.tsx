import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { MessageSquare, Star, Calendar, User, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { showConfirm } from '../../components/CustomAlert';

interface FeedbackItem {
  id: string;
  email: string;
  feedback: string;
  rating: number;
  timestamp: any;
  status?: 'new' | 'reviewed' | 'resolved';
}

const FeedbackManagement: React.FC = () => {
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'reviewed' | 'resolved'>('all');

  useEffect(() => {
    const feedbackQuery = query(
      collection(db, 'feedback'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(feedbackQuery, (snapshot) => {
      const feedbackData: FeedbackItem[] = [];
      snapshot.forEach((doc) => {
        feedbackData.push({
          id: doc.id,
          ...doc.data()
        } as FeedbackItem);
      });
      setFeedbackList(feedbackData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching feedback:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateFeedbackStatus = async (id: string, status: 'new' | 'reviewed' | 'resolved') => {
    try {
      const feedbackRef = doc(db, 'feedback', id);
      await updateDoc(feedbackRef, { status });
    } catch (error) {
      console.error('Error updating feedback status:', error);
    }
  };

  const deleteFeedback = async (id: string) => {
    const shouldDelete = await showConfirm(
      'Are you sure you want to delete this feedback?',
      {
        title: '🗑️ Delete Feedback',
        type: 'warning',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    );
    
    if (shouldDelete) {
      try {
        await deleteDoc(doc(db, 'feedback', id));
      } catch (error) {
        console.error('Error deleting feedback:', error);
      }
    }
  };

  const filteredFeedback = feedbackList.filter(item => {
    if (filter === 'all') return true;
    return item.status === filter || (!item.status && filter === 'new');
  });

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown date';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'reviewed':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusBadge = (status?: string) => {
    const statusText = status || 'new';
    const statusColors = {
      new: 'bg-blue-100 text-blue-800',
      reviewed: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[statusText as keyof typeof statusColors]}`}>
        {statusText.charAt(0).toUpperCase() + statusText.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading feedback...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Feedback Management</h1>
        <p className="text-gray-600">View and manage user feedback submissions</p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['all', 'new', 'reviewed', 'resolved'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  filter === status
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {status === 'all' 
                    ? feedbackList.length 
                    : feedbackList.filter(item => (item.status || 'new') === status).length
                  }
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Feedback List */}
      {filteredFeedback.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback found</h3>
          <p className="text-gray-500">
            {filter === 'all' 
              ? 'No feedback submissions yet.'
              : `No feedback with status "${filter}".`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFeedback.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {getStatusIcon(item.status)}
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-900">{item.email}</span>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">{renderStars(item.rating)}</div>
                    <span className="text-sm text-gray-500">({item.rating}/5)</span>
                  </div>

                  <p className="text-gray-700 mb-3 leading-relaxed">{item.feedback}</p>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(item.timestamp)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <select
                    value={item.status || 'new'}
                    onChange={(e) => updateFeedbackStatus(item.id, e.target.value as any)}
                    className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="new">New</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  
                  <button
                    onClick={() => deleteFeedback(item.id)}
                    className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                    title="Delete feedback"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {feedbackList.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{feedbackList.length}</div>
            <div className="text-sm text-blue-800">Total Feedback</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {feedbackList.filter(item => !item.status || item.status === 'new').length}
            </div>
            <div className="text-sm text-yellow-800">New</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {feedbackList.filter(item => item.status === 'resolved').length}
            </div>
            <div className="text-sm text-green-800">Resolved</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {feedbackList.length > 0 
                ? (feedbackList.reduce((sum, item) => sum + item.rating, 0) / feedbackList.length).toFixed(1)
                : '0'
              }
            </div>
            <div className="text-sm text-purple-800">Avg Rating</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackManagement;
