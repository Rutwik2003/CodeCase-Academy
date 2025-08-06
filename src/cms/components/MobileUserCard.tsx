import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Eye, 
  Edit3, 
  Trash2, 
  UserCheck, 
  UserX,
  Award,
  BookOpen,
  TrendingUp
} from 'lucide-react';

interface User {
  uid: string;
  email: string;
  displayName: string;
  level: number;
  hints: number;
  completedCases: string[];
  totalPoints: number;
  achievements: string[];
  createdAt: any;
  lastLogin: any;
  isActive: boolean;
  referralCode: string;
  referralStats?: {
    totalReferrals: number;
    successfulReferrals: number;
  };
}

interface MobileUserCardProps {
  user: User;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

const MobileUserCard: React.FC<MobileUserCardProps> = ({
  user,
  onView,
  onEdit,
  onDelete,
  onToggleStatus
}) => {
  const formatDate = (date: any) => {
    if (!date) return 'Never';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString();
  };

  const formatTimeAgo = (date: any) => {
    if (!date) return 'Never';
    const d = date.toDate ? date.toDate() : new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 hover:border-white/30 transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            user.isActive ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'
          }`}>
            <span className="text-white font-bold text-sm">
              {user.displayName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm truncate">{user.displayName}</h3>
            <p className="text-white/60 text-xs truncate">{user.email}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          {user.isActive ? (
            <UserCheck className="w-4 h-4 text-green-400" />
          ) : (
            <UserX className="w-4 h-4 text-red-400" />
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white/5 rounded-lg p-2">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-3 h-3 text-blue-400" />
            <span className="text-white/60 text-xs">Level</span>
          </div>
          <p className="text-white font-bold text-sm">{user.level}</p>
        </div>
        
        <div className="bg-white/5 rounded-lg p-2">
          <div className="flex items-center space-x-2">
            <Award className="w-3 h-3 text-yellow-400" />
            <span className="text-white/60 text-xs">Points</span>
          </div>
          <p className="text-white font-bold text-sm">{user.totalPoints}</p>
        </div>
        
        <div className="bg-white/5 rounded-lg p-2">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-3 h-3 text-purple-400" />
            <span className="text-white/60 text-xs">Cases</span>
          </div>
          <p className="text-white font-bold text-sm">{user.completedCases.length}</p>
        </div>
        
        <div className="bg-white/5 rounded-lg p-2">
          <div className="flex items-center space-x-2">
            <Users className="w-3 h-3 text-green-400" />
            <span className="text-white/60 text-xs">Referrals</span>
          </div>
          <p className="text-white font-bold text-sm">{user.referralStats?.totalReferrals || 0}</p>
        </div>
      </div>

      {/* Additional Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-white/60 text-xs">Last Login:</span>
          <span className="text-white text-xs">{formatTimeAgo(user.lastLogin)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/60 text-xs">Joined:</span>
          <span className="text-white text-xs">{formatDate(user.createdAt)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/60 text-xs">Achievements:</span>
          <span className="text-white text-xs">{user.achievements.length}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onView}
          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors border border-blue-500/30 text-xs"
        >
          <Eye className="w-3 h-3" />
          <span>View</span>
        </button>
        
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg transition-colors border border-yellow-500/30 text-xs"
        >
          <Edit3 className="w-3 h-3" />
          <span>Edit</span>
        </button>
        
        <button
          onClick={onToggleStatus}
          className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded-lg transition-colors border text-xs ${
            user.isActive
              ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30'
              : 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/30'
          }`}
        >
          {user.isActive ? <UserX className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
          <span>{user.isActive ? 'Disable' : 'Enable'}</span>
        </button>
        
        <button
          onClick={onDelete}
          className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors border border-red-500/30"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
};

export default MobileUserCard;
