import React from 'react';
import { ArrowLeft, Shield, Lock, Eye, Database, Users, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface PrivacyPageProps {
  onBack: () => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onBack }) => {
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
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm border border-green-400/30 rounded-2xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-100">Privacy Policy</h1>
                <p className="text-slate-400 text-sm">Your data security & privacy</p>
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
            <Shield className="w-8 h-8 text-green-400" />
            <h2 className="text-3xl font-bold text-slate-100">Our Commitment to Your Privacy</h2>
          </div>
          <p className="text-slate-300 text-lg leading-relaxed mb-4">
            At CodeCase Detective Academy, we take your privacy seriously. This policy explains how we collect, 
            use, and protect your personal information when you use our gamified learning platform.
          </p>
          <p className="text-slate-300 leading-relaxed">
            <strong>Last updated:</strong> August 2, 2025
          </p>
        </motion.section>

        {/* Data Collection */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-slate-800/40 via-slate-700/20 to-slate-800/40 backdrop-blur-md border border-slate-600/30 rounded-xl p-8 mb-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Database className="w-8 h-8 text-blue-400" />
            <h2 className="text-2xl font-bold text-slate-100">What Information We Collect</h2>
          </div>
          <div className="space-y-6">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="font-semibold text-slate-100 mb-2">Account Information</h3>
                <p className="text-slate-300 text-sm">
                  When you create an account, we collect your email address, display name, and authentication data 
                  through Firebase Authentication. This helps us provide personalized learning experiences.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="font-semibold text-slate-100 mb-2">Learning Progress</h3>
                <p className="text-slate-300 text-sm">
                  We track your detective case completions, achievements, and learning progress to help you 
                  continue where you left off and earn your detective badges.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="font-semibold text-slate-100 mb-2">Feedback & Communications</h3>
                <p className="text-slate-300 text-sm">
                  When you submit feedback or contact us, we store your messages to improve our platform 
                  and provide support. You can choose to submit feedback anonymously.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Data Security */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-800/40 via-green-700/20 to-green-800/40 backdrop-blur-md border border-green-600/30 rounded-xl p-8 mb-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Lock className="w-8 h-8 text-green-400" />
            <h2 className="text-2xl font-bold text-slate-100">How We Protect Your Data</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-green-400 text-lg">🔐</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100 mb-1">Military-Grade Encryption</h3>
                  <p className="text-slate-300 text-sm">All data is encrypted in transit and at rest using industry-standard AES-256 encryption.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-400 text-lg">☁️</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100 mb-1">Secure Cloud Infrastructure</h3>
                  <p className="text-slate-300 text-sm">We use Firebase and Google Cloud, which maintain SOC 2 Type II compliance and GDPR readiness.</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-400 text-lg">🛡️</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100 mb-1">Access Controls</h3>
                  <p className="text-slate-300 text-sm">Strict authentication and authorization ensure only you can access your detective progress.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-400 text-lg">🔍</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100 mb-1">Regular Security Audits</h3>
                  <p className="text-slate-300 text-sm">We continuously monitor and audit our systems for potential security vulnerabilities.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Data Usage */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-slate-800/40 via-slate-700/20 to-slate-800/40 backdrop-blur-md border border-slate-600/30 rounded-xl p-8 mb-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Eye className="w-8 h-8 text-purple-400" />
            <h2 className="text-2xl font-bold text-slate-100">How We Use Your Information</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-700/20 rounded-lg p-6 border border-slate-600/30">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold text-blue-300 mb-3">Personalized Learning</h3>
              <p className="text-slate-300 text-sm">
                We use your progress data to recommend appropriate detective cases and track your advancement through the academy.
              </p>
            </div>
            <div className="bg-slate-700/20 rounded-lg p-6 border border-slate-600/30">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-green-300 mb-3">Platform Improvement</h3>
              <p className="text-slate-300 text-sm">
                Anonymous usage analytics help us improve the learning experience and develop better detective cases.
              </p>
            </div>
            <div className="bg-slate-700/20 rounded-lg p-6 border border-slate-600/30">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-lg font-semibold text-amber-300 mb-3">Achievement System</h3>
              <p className="text-slate-300 text-sm">
                Your progress data enables our badge and achievement system, celebrating your detective milestones.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Your Rights */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-slate-800/40 via-slate-700/20 to-slate-800/40 backdrop-blur-md border border-slate-600/30 rounded-xl p-8 mb-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Users className="w-8 h-8 text-amber-400" />
            <h2 className="text-2xl font-bold text-slate-100">Your Rights & Control</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <span className="text-green-400 text-lg">✓</span>
              <p className="text-slate-300 text-sm">
                <strong>Access:</strong> You can view all your personal data and learning progress at any time through your profile.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-400 text-lg">✓</span>
              <p className="text-slate-300 text-sm">
                <strong>Correction:</strong> Update your account information and preferences directly in your profile settings.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-400 text-lg">✓</span>
              <p className="text-slate-300 text-sm">
                <strong>Deletion:</strong> Request complete account deletion through our Discord community or profile settings.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-400 text-lg">✓</span>
              <p className="text-slate-300 text-sm">
                <strong>Portability:</strong> Export your learning progress and achievement data at any time.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Contact */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-blue-800/40 via-blue-700/20 to-blue-800/40 backdrop-blur-md border border-blue-600/30 rounded-xl p-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Calendar className="w-8 h-8 text-blue-400" />
            <h2 className="text-2xl font-bold text-slate-100">Questions About Privacy?</h2>
          </div>
          <div className="text-center">
            <p className="text-slate-300 text-lg mb-6">
              Have questions about how we handle your data? Join our Discord community where our team 
              is available to discuss privacy concerns and provide transparency about our practices.
            </p>
            <button
              onClick={() => window.open('https://discord.rutwikdev.com/', '_blank', 'noopener noreferrer')}
              className="inline-flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              <span>💬</span>
              <span>Join Discord for Privacy Support</span>
            </button>
          </div>
        </motion.section>
      </div>
    </div>
  );
};
