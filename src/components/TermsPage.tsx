import React from 'react';
import { ArrowLeft, Scale, BookOpen, Users, AlertTriangle, CheckCircle, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

interface TermsPageProps {
  onBack: () => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onBack }) => {
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
                <Scale className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-100">Terms of Service</h1>
                <p className="text-slate-400 text-sm">CodeCase Detective Academy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Introduction */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-800/40 via-slate-700/20 to-slate-800/40 backdrop-blur-md border border-slate-600/30 rounded-xl p-8 mb-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Scale className="w-8 h-8 text-amber-400" />
            <h2 className="text-3xl font-bold text-slate-100">Welcome to the Detective Academy</h2>
          </div>
          <p className="text-slate-300 text-lg leading-relaxed mb-4">
            By accessing and using CodeCase Detective Academy, you agree to be bound by these Terms of Service. 
            Our platform is designed to provide an engaging, gamified learning experience for HTML and CSS education.
          </p>
          <p className="text-slate-300 leading-relaxed">
            <strong>Effective Date:</strong> August 2, 2025 | <strong>Last Updated:</strong> August 2, 2025
          </p>
        </motion.section>

        {/* Platform Use */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-slate-800/40 via-slate-700/20 to-slate-800/40 backdrop-blur-md border border-slate-600/30 rounded-xl p-8 mb-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <BookOpen className="w-8 h-8 text-blue-400" />
            <h2 className="text-2xl font-bold text-slate-100">Platform Usage Guidelines</h2>
          </div>
          <div className="space-y-6">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-slate-100 mb-2">Educational Purpose</h3>
                <p className="text-slate-300 text-sm">
                  CodeCase Detective Academy is designed for educational purposes to help you learn HTML, CSS, 
                  and web development through interactive detective cases and gamified challenges.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-slate-100 mb-2">Account Responsibility</h3>
                <p className="text-slate-300 text-sm">
                  You are responsible for maintaining the security of your account credentials and for all 
                  activities that occur under your account. Choose a strong password and keep it confidential.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-slate-100 mb-2">Respectful Community</h3>
                <p className="text-slate-300 text-sm">
                  Maintain a respectful and supportive environment for all detectives. Harassment, spam, 
                  or inappropriate content is not tolerated in our Discord community or feedback systems.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Learning Content */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-800/40 via-green-700/20 to-green-800/40 backdrop-blur-md border border-green-600/30 rounded-xl p-8 mb-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Users className="w-8 h-8 text-green-400" />
            <h2 className="text-2xl font-bold text-slate-100">Learning Content & Intellectual Property</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-green-400 text-lg">📚</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100 mb-1">Free Educational Content</h3>
                  <p className="text-slate-300 text-sm">
                    All detective cases, tutorials, and learning materials are provided free of charge for educational purposes.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-400 text-lg">🎯</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100 mb-1">Learning Progress Ownership</h3>
                  <p className="text-slate-300 text-sm">
                    Your progress, achievements, and completed cases belong to you. You can export your data at any time.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-400 text-lg">©️</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100 mb-1">Platform Content Protection</h3>
                  <p className="text-slate-300 text-sm">
                    The detective cases, stories, and platform design are protected by copyright. Please don't redistribute without permission.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-400 text-lg">🤝</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100 mb-1">User-Generated Content</h3>
                  <p className="text-slate-300 text-sm">
                    Feedback and suggestions you provide help improve the platform. You retain ownership of your contributions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Service Availability */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-slate-800/40 via-slate-700/20 to-slate-800/40 backdrop-blur-md border border-slate-600/30 rounded-xl p-8 mb-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <AlertTriangle className="w-8 h-8 text-orange-400" />
            <h2 className="text-2xl font-bold text-slate-100">Service Availability & Limitations</h2>
          </div>
          <div className="space-y-4">
            <div className="bg-orange-500/10 border border-orange-400/30 rounded-lg p-4">
              <h3 className="font-semibold text-orange-200 mb-2">⚡ Beta Platform Notice</h3>
              <p className="text-orange-100 text-sm">
                CodeCase Detective Academy is currently in active development. While we strive for 100% uptime, 
                there may be occasional maintenance periods or feature updates that temporarily affect service availability.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-blue-400 text-lg">ℹ️</span>
              <p className="text-slate-300 text-sm">
                <strong>No Warranties:</strong> The platform is provided "as is" for educational purposes. 
                We continuously improve the learning experience but cannot guarantee uninterrupted service.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-400 text-lg">💡</span>
              <p className="text-slate-300 text-sm">
                <strong>Best Effort Support:</strong> Our team provides community support through Discord. 
                While we can't guarantee immediate responses, we're committed to helping every detective succeed.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Privacy & Data */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-slate-800/40 via-slate-700/20 to-slate-800/40 backdrop-blur-md border border-slate-600/30 rounded-xl p-8 mb-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <CheckCircle className="w-8 h-8 text-green-400" />
            <h2 className="text-2xl font-bold text-slate-100">Your Rights & Our Responsibilities</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-green-300 mb-3">Your Rights</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-slate-300 text-sm">Learn at your own pace</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-slate-300 text-sm">Access all educational content</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-slate-300 text-sm">Delete your account anytime</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-slate-300 text-sm">Export your learning progress</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-blue-300 mb-3">Our Commitments</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-400">✓</span>
                  <span className="text-slate-300 text-sm">Protect your data & privacy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-400">✓</span>
                  <span className="text-slate-300 text-sm">Provide quality learning content</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-400">✓</span>
                  <span className="text-slate-300 text-sm">Maintain platform security</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-400">✓</span>
                  <span className="text-slate-300 text-sm">Support the learning community</span>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Contact & Changes */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-blue-800/40 via-blue-700/20 to-blue-800/40 backdrop-blur-md border border-blue-600/30 rounded-xl p-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <MessageSquare className="w-8 h-8 text-blue-400" />
            <h2 className="text-2xl font-bold text-slate-100">Questions & Updates</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-300 mb-3">Terms Updates</h3>
              <p className="text-slate-300 text-sm mb-4">
                We may update these terms as the platform evolves. Significant changes will be announced 
                through our Discord community, and continued use constitutes acceptance of updated terms.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-300 mb-3">Need Help?</h3>
              <p className="text-slate-300 text-sm mb-4">
                Have questions about these terms or need support? Join our Discord community where 
                our team and fellow detectives are ready to help you succeed in your learning journey.
              </p>
            </div>
          </div>
          <div className="text-center mt-6">
            <button
              onClick={() => window.open('https://discord.rutwikdev.com/', '_blank', 'noopener noreferrer')}
              className="inline-flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              <span>💬</span>
              <span>Join Discord Community</span>
            </button>
          </div>
        </motion.section>
      </div>
    </div>
  );
};
