import React, { useState } from 'react';
import { ArrowLeft, Users, Target, Award, Star, Send, CheckCircle, MessageSquare, Code, Book, Trophy, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface AboutPageProps {
  onBack: () => void;
}

interface FeedbackData {
  name: string;
  email: string;
  message: string;
  rating: number;
  category: string;
  isAnonymous: boolean;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onBack }) => {
  const { currentUser, userData } = useAuth();
  const [feedbackData, setFeedbackData] = useState<FeedbackData>({
    name: userData?.displayName || '',
    email: currentUser?.email || '',
    message: '',
    rating: 5,
    category: 'general',
    isAnonymous: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedbackSuccess, setShowFeedbackSuccess] = useState(false);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedbackData.message.trim()) {
      toast.error('Please enter your feedback message');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare feedback data for Firebase
      const feedbackPayload = {
        message: feedbackData.message.trim(),
        rating: feedbackData.rating,
        category: feedbackData.category,
        isAnonymous: feedbackData.isAnonymous,
        submittedAt: Timestamp.now(),
        source: 'about_page',
        // Only include user info if not anonymous
        ...(feedbackData.isAnonymous ? {} : {
          name: feedbackData.name || 'Anonymous',
          email: feedbackData.email || 'Not provided',
          userId: currentUser?.uid || null
        }),
        // Always include basic metadata
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        status: 'new'
      };

      // Save to Firebase 'feedback' collection
      await addDoc(collection(db, 'feedback'), feedbackPayload);

      // Show success message
      setShowFeedbackSuccess(true);
      toast.success('Thank you for your feedback! 🎉');

      // Reset form
      setFeedbackData({
        name: userData?.displayName || '',
        email: currentUser?.email || '',
        message: '',
        rating: 5,
        category: 'general',
        isAnonymous: false
      });

      // Hide success message after 3 seconds
      setTimeout(() => setShowFeedbackSuccess(false), 3000);

    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FeedbackData, value: any) => {
    setFeedbackData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderStarRating = () => {
    const handleStarClick = (starPosition: number, isHalf: boolean) => {
      const rating = isHalf ? starPosition - 0.5 : starPosition;
      handleInputChange('rating', rating);
    };

    const renderStar = (starNumber: number) => {
      const isFullStar = feedbackData.rating >= starNumber;
      const isHalfStar = feedbackData.rating >= starNumber - 0.5 && feedbackData.rating < starNumber;
      
      return (
        <div key={starNumber} className="relative w-8 h-8">
          {/* Full star clickable area */}
          <button
            type="button"
            onClick={() => handleStarClick(starNumber, false)}
            className={`absolute inset-0 w-full h-full transition-colors z-10 ${
              isFullStar ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-300'
            }`}
          >
            <Star 
              className="w-full h-full" 
              fill={isFullStar ? 'currentColor' : 'none'} 
            />
          </button>
          
          {/* Half star clickable area (left half) */}
          <button
            type="button"
            onClick={() => handleStarClick(starNumber, true)}
            className="absolute inset-0 w-1/2 h-full z-20"
            title={`${starNumber - 0.5} stars`}
          >
            {/* Invisible clickable area for half star */}
          </button>
          
          {/* Half star visual overlay */}
          {isHalfStar && (
            <div className="absolute inset-0 w-1/2 h-full overflow-hidden z-5">
              <Star 
                className="w-8 h-8 text-yellow-400" 
                fill="currentColor"
              />
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map(renderStar)}
          <span className="ml-3 text-sm text-slate-300 font-medium">
            {feedbackData.rating} star{feedbackData.rating !== 1 ? 's' : ''}
          </span>
        </div>
        
        {/* Quick rating buttons */}
        <div className="flex flex-wrap gap-2">
          {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(rating => (
            <button
              key={rating}
              type="button"
              onClick={() => handleInputChange('rating', rating)}
              className={`px-3 py-1 text-xs rounded-full border transition-all duration-200 ${
                feedbackData.rating === rating
                  ? 'bg-yellow-400/20 border-yellow-400/50 text-yellow-300'
                  : 'bg-slate-700/30 border-slate-600/50 text-slate-400 hover:border-yellow-400/30 hover:text-yellow-300'
              }`}
            >
              {rating}★
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-blue-500/5"></div>
      
      {/* Header */}
      <div className="relative bg-gradient-to-r from-slate-950/95 via-slate-900/90 to-slate-950/95 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-800/50 backdrop-blur-sm rounded-lg transition-colors border border-slate-700/30"
            >
              <ArrowLeft className="w-5 h-5 text-slate-400" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-amber-600/20 backdrop-blur-sm border border-amber-400/30 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">🕵️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-100">About CodeCase</h1>
                <p className="text-slate-400 text-sm">Detective Academy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-8xl">
        {/* Mission Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-800/40 via-slate-700/20 to-slate-800/40 backdrop-blur-md border border-slate-600/30 rounded-xl p-8 mb-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Target className="w-8 h-8 text-amber-400" />
            <h2 className="text-3xl font-bold text-slate-100">Why Choose CodeCase Academy?</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-amber-400 mb-4">🎮 Learning HTML & CSS Should Be Fun!</h3>
              <p className="text-slate-300 text-lg leading-relaxed mb-4">
                Tired of boring tutorials and endless documentation? CodeCase Detective Academy transforms 
                traditional web development learning into an exciting detective adventure where you solve real 
                coding mysteries.
              </p>
              <p className="text-slate-300 leading-relaxed mb-4">
                Instead of memorizing syntax, you'll investigate crime scenes, debug broken websites, and 
                uncover the truth behind HTML structure and CSS styling through interactive storytelling.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-400 mb-4">🏆 Gamified Learning That Works</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="text-green-400 text-lg">✓</span>
                  <p className="text-slate-300 text-sm">
                    <strong>Progressive Challenges:</strong> Start with basic HTML mysteries and advance to complex CSS investigations
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-green-400 text-lg">✓</span>
                  <p className="text-slate-300 text-sm">
                    <strong>Detective Badges:</strong> Earn achievements for mastering different web technologies
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-green-400 text-lg">✓</span>
                  <p className="text-slate-300 text-sm">
                    <strong>Real-World Projects:</strong> Debug actual websites and solve practical coding problems
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-green-400 text-lg">✓</span>
                  <p className="text-slate-300 text-sm">
                    <strong>Community Support:</strong> Join fellow detectives and learn together
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Target Audience Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-purple-800/40 via-purple-700/20 to-purple-800/40 backdrop-blur-md border border-purple-600/30 rounded-xl p-8 mb-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Users className="w-8 h-8 text-purple-400" />
            <h2 className="text-3xl font-bold text-slate-100">Perfect For You If...</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-700/30 rounded-lg p-6 border border-purple-500/20">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold text-purple-300 mb-3">Beginner Developers</h3>
              <p className="text-slate-300 text-sm">
                New to coding? Perfect! Our detective cases guide you from HTML basics to advanced CSS 
                with engaging storylines that make learning stick.
              </p>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-6 border border-blue-500/20">
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="text-lg font-semibold text-blue-300 mb-3">Visual Learners</h3>
              <p className="text-slate-300 text-sm">
                Learn by seeing, doing, and solving. Our interactive approach shows you exactly how 
                HTML and CSS work through hands-on debugging challenges.
              </p>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-6 border border-green-500/20">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-lg font-semibold text-green-300 mb-3">Career Switchers</h3>
              <p className="text-slate-300 text-sm">
                Transitioning to tech? Build confidence with real-world projects and practical skills 
                that employers value in today's web development market.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Platform Statistics */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm border border-blue-400/30 rounded-xl p-6 text-center">
            <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">New</div>
            <div className="text-blue-200 text-sm">Launch Platform</div>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm border border-green-400/30 rounded-xl p-6 text-center">
            <Book className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">2+</div>
            <div className="text-green-200 text-sm">Detective Cases</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-400/30 rounded-xl p-6 text-center">
            <Trophy className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">Fresh</div>
            <div className="text-purple-200 text-sm">Learning Content</div>
          </div>
          <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/20 backdrop-blur-sm border border-amber-400/30 rounded-xl p-6 text-center">
            <Star className="w-8 h-8 text-amber-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">2025</div>
            <div className="text-amber-200 text-sm">Newly Built</div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-slate-800/40 via-slate-700/20 to-slate-800/40 backdrop-blur-md border border-slate-600/30 rounded-xl p-8 mb-8"
        >
          <h2 className="text-3xl font-bold text-slate-100 mb-6 flex items-center space-x-3">
            <Code className="w-8 h-8 text-purple-400" />
            <span>How Our Gamified Learning Works</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-400 text-lg">🕵️</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100 mb-1">Story-Driven HTML Lessons</h3>
                  <p className="text-slate-300 text-sm">Learn HTML structure by investigating broken websites and fixing document crimes. Each element has a purpose in solving the mystery!</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-400 text-lg">🎨</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100 mb-1">CSS Detective Cases</h3>
                  <p className="text-slate-300 text-sm">Debug styling mysteries, hunt down visual bugs, and master CSS selectors through engaging forensic challenges.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-green-400 text-lg">📱</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100 mb-1">Responsive Design Missions</h3>
                  <p className="text-slate-300 text-sm">Solve mobile compatibility cases and learn responsive design through device-specific investigations.</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-400 text-lg">🏆</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100 mb-1">Achievement & Badge System</h3>
                  <p className="text-slate-300 text-sm">Unlock detective badges for mastering HTML tags, CSS properties, and completing investigation challenges.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-red-400 text-lg">⚡</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100 mb-1">Instant Feedback & Hints</h3>
                  <p className="text-slate-300 text-sm">Get immediate validation when you fix code issues, with detective hints to guide you when you're stuck.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-400 text-lg">👥</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100 mb-1">Learn with Fellow Detectives</h3>
                  <p className="text-slate-300 text-sm">Join study groups, share discoveries, and collaborate on challenging cases with other HTML & CSS learners.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-slate-800/40 via-slate-700/20 to-slate-800/40 backdrop-blur-md border border-slate-600/30 rounded-xl p-8 mb-8"
        >
          <h2 className="text-3xl font-bold text-slate-100 mb-6 flex items-center space-x-3">
            <Award className="w-8 h-8 text-green-400" />
            <span>Meet the Team</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-700/20 rounded-lg p-6 border border-slate-600/30">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-500/50">
                  <img 
                    src="/assets/rutwik_butani.png" 
                    alt="Rutwik Butani"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-100">Rutwik Butani</h3>
                  <p className="text-amber-400">Lead Detective & Founder</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm">
                Full-stack developer and passionate about making coding accessible and fun.
              </p>
            </div>
            <div className="bg-slate-700/20 rounded-lg p-6 border border-slate-600/30">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500/50">
                  <img 
                    src="/assets/Vasanth_Profile.jpeg" 
                    alt="Venkata Vasanth Sunkara"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-100">Venkata Vasanth Sunkara</h3>
                  <p className="text-blue-400">Story Architect & Case Designer</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm">
                Creative mastermind behind our compelling case stories and character development. 
                Crafts immersive detective narratives that bring each coding challenge to life.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Contact Information */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-slate-800/40 via-slate-700/20 to-slate-800/40 backdrop-blur-md border border-slate-600/30 rounded-xl p-8 mb-8"
        >
          <h2 className="text-3xl font-bold text-slate-100 mb-6 flex items-center space-x-3">
            <MessageSquare className="w-8 h-8 text-blue-400" />
            <span>Contact Detective HQ</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <MessageSquare className="w-6 h-6 text-green-400 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-100 mb-1">Community</h3>
                <p className="text-slate-300 text-sm">Join our Discord</p>
                <p className="text-slate-400 text-xs">Chat with fellow detectives</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Calendar className="w-6 h-6 text-purple-400 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-100 mb-1">Office Hours</h3>
                <p className="text-slate-300 text-sm">24/7 Online</p>
                <p className="text-slate-400 text-xs">Always investigating</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Feedback Form */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-slate-800/40 via-slate-700/20 to-slate-800/40 backdrop-blur-md border border-slate-600/30 rounded-xl p-8"
        >
          <h2 className="text-3xl font-bold text-slate-100 mb-6 flex items-center space-x-3">
            <Send className="w-8 h-8 text-emerald-400" />
            <span>Share Your Feedback</span>
          </h2>
          
          <AnimatePresence>
            {showFeedbackSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-green-500/20 border border-green-400/30 rounded-lg p-4 mb-6 flex items-center space-x-3"
              >
                <CheckCircle className="w-6 h-6 text-green-400" />
                <div>
                  <h3 className="font-semibold text-green-100">Feedback Submitted!</h3>
                  <p className="text-green-200 text-sm">Thank you for helping us improve CodeCase Detective Academy.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleFeedbackSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-100 font-medium mb-2">
                  Your Name {feedbackData.isAnonymous && <span className="text-slate-400">(Hidden)</span>}
                </label>
                <input
                  type="text"
                  value={feedbackData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={feedbackData.isAnonymous}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-slate-100 font-medium mb-2">
                  Email Address {feedbackData.isAnonymous && <span className="text-slate-400">(Hidden)</span>}
                </label>
                <input
                  type="email"
                  value={feedbackData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={feedbackData.isAnonymous}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-100 font-medium mb-2">Category</label>
                <select
                  value={feedbackData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="general">General Feedback</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                  <option value="course">Course Content</option>
                  <option value="ui">User Interface</option>
                  <option value="performance">Performance Issue</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-100 font-medium mb-2">Rating</label>
                {renderStarRating()}
              </div>
            </div>

            <div>
              <label className="block text-slate-100 font-medium mb-2">Your Feedback</label>
              <textarea
                value={feedbackData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                rows={5}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                placeholder="Share your thoughts, suggestions, or report any issues you've encountered..."
                required
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="anonymous"
                checked={feedbackData.isAnonymous}
                onChange={(e) => handleInputChange('isAnonymous', e.target.checked)}
                className="w-4 h-4 text-emerald-500 border-slate-600 rounded focus:ring-emerald-500"
              />
              <label htmlFor="anonymous" className="text-slate-300 text-sm">
                Submit anonymously (your name and email won't be saved)
              </label>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-slate-400 text-sm">
                Your feedback helps us improve the detective experience for everyone.
              </p>
              <button
                type="submit"
                disabled={isSubmitting || !feedbackData.message.trim()}
                className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Feedback</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.section>
      </div>
    </div>
  );
};
