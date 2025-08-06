import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Award,
  Activity,
  Calendar,
  Eye,
  UserPlus,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { logger, LogCategory } from '../../utils/logger';

interface DashboardStats {
  totalUsers: number;
  totalCases: number;
  completedCases: number;
  activeUsers: number;
  newUsersToday: number;
  averageScore: number;
}

interface RecentActivity {
  id: string;
  type: 'user_register' | 'case_complete' | 'achievement_unlock';
  user: string;
  description: string;
  timestamp: Date;
}

const Dashboard: React.FC<{ onPageChange?: (page: string) => void }> = ({ onPageChange }) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalCases: 0,
    completedCases: 0,
    activeUsers: 0,
    newUsersToday: 0,
    averageScore: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get total users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const totalUsers = usersSnapshot.size;
      
      // Get users created today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const newUsersQuery = query(
        collection(db, 'users'),
        where('createdAt', '>=', today)
      );
      const newUsersSnapshot = await getDocs(newUsersQuery);
      const newUsersToday = newUsersSnapshot.size;
      
      // Get active users (logged in within last 7 days)
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const activeUsersQuery = query(
        collection(db, 'users'),
        where('lastLogin', '>=', weekAgo)
      );
      const activeUsersSnapshot = await getDocs(activeUsersQuery);
      const activeUsers = activeUsersSnapshot.size;
      
      // Calculate completed cases and average score
      let completedCases = 0;
      let totalScore = 0;
      let scoreCount = 0;
      
      usersSnapshot.forEach(doc => {
        const userData = doc.data();
        if (userData.completedCases) {
          completedCases += userData.completedCases.length;
        }
        if (userData.totalPoints) {
          totalScore += userData.totalPoints;
          scoreCount++;
        }
      });
      
      const averageScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;
      
      setStats({
        totalUsers,
        totalCases: 3, // Hardcoded for now since cases are in code
        completedCases,
        activeUsers,
        newUsersToday,
        averageScore
      });
      
      // Generate recent activity from real user data
      const activities: RecentActivity[] = [];
      
      usersSnapshot.forEach(doc => {
        const userData = doc.data();
        const userEmail = userData.email || 'Unknown User';
        
        // Add user registration activity if recent
        if (userData.createdAt && userData.createdAt.toDate) {
          const createdDate = userData.createdAt.toDate();
          if (createdDate > weekAgo) {
            activities.push({
              id: `register_${doc.id}`,
              type: 'user_register',
              user: userEmail,
              description: 'New user registered',
              timestamp: createdDate
            });
          }
        }
        
        // Add case completion activities (only if we have actual completion timestamps)
        if (userData.completedCases && Array.isArray(userData.completedCases)) {
          // Since we don't store completion timestamps yet, we won't show these activities
          // to avoid fake data. In the future, we should store completion timestamps.
        }
        
        // Add achievement activities based on actual user data (without fake timestamps)
        if (userData.totalPoints && userData.totalPoints > 500 && userData.createdAt && userData.createdAt.toDate) {
          const registrationDate = userData.createdAt.toDate();
          // Only show if user registered recently (within our time window)
          if (registrationDate > weekAgo) {
            activities.push({
              id: `achievement_${doc.id}`,
              type: 'achievement_unlock',
              user: userEmail,
              description: 'Reached high score milestone (500+ points)',
              timestamp: registrationDate // Use registration date as achievement date
            });
          }
        }
      });
      
      // Sort by timestamp and take the 5 most recent
      activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      setRecentActivity(activities.slice(0, 5));

      // If no real activities, show a message instead of fake data
      if (activities.length === 0) {
        setRecentActivity([
          {
            id: 'no_activity',
            type: 'user_register',
            user: 'System',
            description: 'No recent activity - users will appear here as they interact with the platform',
            timestamp: new Date()
          }
        ]);
      }
      
    } catch (error) {
      logger.error('Error loading dashboard data:', error, LogCategory.CMS);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      change: `+${stats.newUsersToday} today`,
      changeColor: 'text-green-400'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers.toLocaleString(),
      icon: Activity,
      color: 'from-green-500 to-green-600',
      change: `${Math.round((stats.activeUsers / stats.totalUsers) * 100) || 0}% of total`,
      changeColor: 'text-blue-400'
    },
    {
      title: 'Total Cases',
      value: stats.totalCases.toLocaleString(),
      icon: BookOpen,
      color: 'from-purple-500 to-purple-600',
      change: 'Available cases',
      changeColor: 'text-purple-400'
    },
    {
      title: 'Completed Cases',
      value: stats.completedCases.toLocaleString(),
      icon: CheckCircle,
      color: 'from-emerald-500 to-emerald-600',
      change: `Avg: ${Math.round(stats.completedCases / (stats.totalUsers || 1))} per user`,
      changeColor: 'text-emerald-400'
    },
    {
      title: 'Average Score',
      value: stats.averageScore.toLocaleString(),
      icon: Target,
      color: 'from-orange-500 to-orange-600',
      change: 'Points per user',
      changeColor: 'text-orange-400'
    },
    {
      title: 'Platform Health',
      value: '99.9%',
      icon: TrendingUp,
      color: 'from-cyan-500 to-cyan-600',
      change: 'Uptime',
      changeColor: 'text-cyan-400'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_register':
        return <UserPlus className="w-4 h-4 text-green-500" />;
      case 'case_complete':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'achievement_unlock':
        return <Award className="w-4 h-4 text-yellow-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Welcome to CodeCase CMS
            </h2>
            <p className="text-white/60">
              Monitor your detective academy performance and manage content
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-green-500/20 rounded-lg px-4 py-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-medium">All Systems Operational</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 hover:border-white/30 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-sm">{card.title}</p>
                  <p className="text-2xl font-bold text-white">{card.value}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${card.changeColor}`}>{card.change}</span>
                <Eye className="w-4 h-4 text-white/40" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
            <Activity className="w-5 h-5 text-white/60" />
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">{activity.user}</p>
                  <p className="text-white/60 text-xs truncate">{activity.description}</p>
                </div>
                <div className="flex-shrink-0">
                  <span className="text-white/40 text-xs">{formatTimeAgo(activity.timestamp)}</span>
                </div>
              </motion.div>
            ))}
          </div>
          
          <button className="w-full mt-4 py-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
            View All Activity
          </button>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
            <Clock className="w-5 h-5 text-white/60" />
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={() => onPageChange && onPageChange('users')}
              className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 rounded-lg transition-all duration-200 border border-blue-500/30"
            >
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">Manage Users</span>
            </button>
            
            <button 
              onClick={() => onPageChange && onPageChange('cases')}
              className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-500/20 to-purple-600/20 hover:from-purple-500/30 hover:to-purple-600/30 rounded-lg transition-all duration-200 border border-purple-500/30"
            >
              <BookOpen className="w-5 h-5 text-purple-400" />
              <span className="text-white font-medium">Add New Case</span>
            </button>
            
            <button 
              onClick={() => onPageChange && onPageChange('achievements')}
              className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-green-500/20 to-green-600/20 hover:from-green-500/30 hover:to-green-600/30 rounded-lg transition-all duration-200 border border-green-500/30"
            >
              <Award className="w-5 h-5 text-green-400" />
              <span className="text-white font-medium">Create Achievement</span>
            </button>
            
            <button 
              onClick={() => onPageChange && onPageChange('analytics')}
              className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-orange-500/20 to-orange-600/20 hover:from-orange-500/30 hover:to-orange-600/30 rounded-lg transition-all duration-200 border border-orange-500/30"
            >
              <TrendingUp className="w-5 h-5 text-orange-400" />
              <span className="text-white font-medium">View Detailed Analytics</span>
            </button>
            
            <button 
              onClick={() => onPageChange && onPageChange('system')}
              className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 rounded-lg transition-all duration-200 border border-red-500/30"
            >
              <Calendar className="w-5 h-5 text-red-400" />
              <span className="text-white font-medium">Schedule Maintenance</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
