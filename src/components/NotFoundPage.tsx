import React from 'react';
import { Search, Home, ArrowLeft, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface NotFoundPageProps {
  onGoHome?: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onGoHome }) => {
  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-amber-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-32 right-20 w-48 h-48 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="max-w-2xl mx-auto text-center relative z-10">
        {/* Detective Badge with Error */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <div className="w-32 h-32 bg-gradient-to-br from-slate-800 to-slate-700 rounded-3xl flex items-center justify-center border-2 border-amber-400/30 shadow-2xl">
              <Search className="w-16 h-16 text-amber-400" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Case Number */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <div className="inline-block bg-slate-800/50 backdrop-blur-sm border border-amber-400/30 rounded-lg px-4 py-2">
            <span className="text-amber-400 font-mono text-sm tracking-wider">CASE #404</span>
          </div>
        </motion.div>

        {/* Error Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-5xl md:text-6xl font-bold text-slate-100 mb-4"
        >
          Missing Evidence
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-2xl md:text-3xl font-semibold text-amber-400 mb-6"
        >
          Page Not Found
        </motion.h2>

        {/* Detective Report */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-slate-800/30 backdrop-blur-sm border border-slate-600/30 rounded-xl p-6 mb-8"
        >
          <div className="text-left">
            <h3 className="text-amber-400 font-semibold mb-3 flex items-center">
              <span className="mr-2">🕵️</span>
              Detective Report
            </h3>
            <div className="space-y-2 text-slate-300">
              <p><span className="text-slate-400">Status:</span> <span className="text-red-400">Evidence Missing</span></p>
              <p><span className="text-slate-400">Location:</span> Unknown URL</p>
              <p><span className="text-slate-400">Last Seen:</span> Never existed</p>
              <p><span className="text-slate-400">Recommendation:</span> Return to headquarters</p>
            </div>
          </div>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-xl text-slate-400 mb-8 leading-relaxed"
        >
          The digital trail has gone cold. This page seems to have vanished without a trace.
          <br />
          Let's head back to the <span className="text-amber-400 font-semibold">Command Center</span> and start a new investigation.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            onClick={handleGoHome}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center space-x-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-2xl hover:shadow-amber-500/25 transition-all duration-300"
          >
            <Home className="w-5 h-5" />
            <span>Return to Command Center</span>
          </motion.button>

          <motion.button
            onClick={() => window.history.back()}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center space-x-3 bg-slate-800/50 border border-slate-600/50 text-slate-300 hover:text-amber-300 hover:border-amber-400/50 px-8 py-4 rounded-xl font-semibold text-lg backdrop-blur-sm transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </motion.button>
        </motion.div>

        {/* Footer Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-12 text-center"
        >
          <p className="text-slate-500 text-sm">
            Need assistance? Contact the <span className="text-amber-400">Detective Academy</span> support team.
          </p>
        </motion.div>
      </div>
    </div>
  );
};
