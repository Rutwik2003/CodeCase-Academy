import React from 'react';
import { Play, BookOpen, Users, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { StaggerItem } from './PageTransition';

interface HeroProps {
  onLearnClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onLearnClick }) => {
  const scrollToCases = () => {
    const casesSection = document.getElementById('cases');
    if (casesSection) {
      casesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-32 pb-20">
      {/* Detective Command Center Background */}
      <div className="absolute inset-0">
        {/* Main gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>
        
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 backdrop-blur-3xl bg-gradient-to-br from-slate-900/40 via-slate-800/20 to-slate-900/40"></div>
        
        {/* Detective atmosphere effects */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-20 left-20 w-96 h-96 rounded-full bg-amber-500/10 filter blur-3xl"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ 
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute top-40 right-20 w-80 h-80 rounded-full bg-blue-500/8 filter blur-3xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.15, 0.05, 0.15]
            }}
            transition={{ 
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3
            }}
          />
          <motion.div 
            className="absolute bottom-20 left-40 w-72 h-72 rounded-full bg-emerald-500/6 filter blur-3xl"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.08, 0.15, 0.08]
            }}
            transition={{ 
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 6
            }}
          />
        </div>
      </div>
      
      {/* Detective Command Interface */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Detective Badge */}
          <motion.div 
            className="mb-8 flex items-center justify-center mt-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              <motion.div 
                className="bg-gradient-to-br from-amber-500/20 via-amber-400/10 to-amber-600/20 backdrop-blur-md border border-amber-400/30 rounded-3xl p-8 shadow-2xl shadow-amber-500/10"
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-6xl filter drop-shadow-2xl">🕵️</div>
              </motion.div>
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-amber-400 rounded-full animate-pulse shadow-lg shadow-amber-400/50 flex items-center justify-center">
                <div className="w-2 h-2 bg-black rounded-full"></div>
              </div>
            </div>
          </motion.div>
          
          {/* Main Heading */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-mono text-slate-400 uppercase tracking-[0.3em]">Detective Academy</span>
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-100 mb-6 leading-tight">
              Solve Crimes with{' '}
              <motion.span 
                className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                Code
              </motion.span>
            </h1>
            
            <motion.p 
              className="text-lg md:text-xl lg:text-2xl text-slate-300 mb-12 leading-relaxed max-w-4xl mx-auto font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Master HTML & CSS by becoming a web detective. Investigate broken websites, 
              uncover digital clues, and solve coding mysteries with your AI forensics partner!
            </motion.p>
          </motion.div>
          {/* Action Buttons with Detective Theme */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <motion.button 
              onClick={scrollToCases}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative bg-gradient-to-r from-amber-600/80 via-yellow-500/80 to-amber-600/80 hover:from-amber-500/90 hover:via-yellow-400/90 hover:to-amber-500/90 text-black px-10 py-5 rounded-xl font-bold text-lg uppercase tracking-wider transition-all duration-500 backdrop-blur-sm border border-amber-400/50 shadow-xl shadow-amber-500/25 hover:shadow-amber-400/40"
            >
              <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex items-center justify-center space-x-3">
                <Play className="w-6 h-6 group-hover:translate-x-1 transition-transform drop-shadow-lg" />
                <span>Begin Investigation</span>
              </div>
            </motion.button>
            
            <motion.button 
              onClick={onLearnClick}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative bg-gradient-to-r from-slate-700/80 via-slate-600/80 to-slate-700/80 hover:from-slate-600/90 hover:via-slate-500/90 hover:to-slate-600/90 text-slate-100 px-10 py-5 rounded-xl font-bold text-lg uppercase tracking-wider transition-all duration-500 backdrop-blur-sm border border-slate-500/50 shadow-xl shadow-slate-700/25 hover:shadow-slate-500/40"
            >
              <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex items-center justify-center space-x-3">
                <BookOpen className="w-6 h-6 group-hover:rotate-6 transition-transform drop-shadow-lg" />
                <span>Training Academy</span>
              </div>
            </motion.button>
          </motion.div>
          {/* Detective Academy Features */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <StaggerItem>
              <motion.div 
                className="relative bg-gradient-to-br from-slate-800/40 via-slate-700/20 to-slate-800/40 backdrop-blur-md border border-slate-600/30 rounded-2xl p-8 shadow-2xl transition-all duration-500 hover:shadow-2xl hover:border-amber-500/40 group h-full flex flex-col"
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <motion.div 
                  className="relative z-10 w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 backdrop-blur-sm border border-emerald-400/30 rounded-2xl flex items-center justify-center mb-6"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Users className="w-8 h-8 text-emerald-400 drop-shadow-lg" />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-100 mb-4 group-hover:text-amber-100 transition-colors">AI Forensics Partner</h3>
                <p className="text-slate-300 leading-relaxed flex-grow">
                  Advanced AI detective provides intelligent hints, code analysis, and investigative guidance throughout your cases.
                </p>
              </motion.div>
            </StaggerItem>
            
            <StaggerItem>
              <motion.div 
                className="relative bg-gradient-to-br from-slate-800/40 via-slate-700/20 to-slate-800/40 backdrop-blur-md border border-slate-600/30 rounded-2xl p-8 shadow-2xl transition-all duration-500 hover:shadow-2xl hover:border-amber-500/40 group h-full flex flex-col"
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <motion.div 
                  className="relative z-10 w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-sm border border-blue-400/30 rounded-2xl flex items-center justify-center mb-6"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <BookOpen className="w-8 h-8 text-blue-400 drop-shadow-lg" />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-100 mb-4 group-hover:text-amber-100 transition-colors">Interactive Crime Scenes</h3>
                <p className="text-slate-300 leading-relaxed flex-grow">
                  Investigate realistic web development scenarios through immersive, hands-on coding challenges.
                </p>
              </motion.div>
            </StaggerItem>
            
            <StaggerItem>
              <motion.div 
                className="relative bg-gradient-to-br from-slate-800/40 via-slate-700/20 to-slate-800/40 backdrop-blur-md border border-slate-600/30 rounded-2xl p-8 shadow-2xl transition-all duration-500 hover:shadow-2xl hover:border-amber-500/40 group h-full flex flex-col"
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <motion.div 
                  className="relative z-10 w-16 h-16 bg-gradient-to-br from-amber-500/20 to-yellow-600/20 backdrop-blur-sm border border-amber-400/30 rounded-2xl flex items-center justify-center mb-6"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Award className="w-8 h-8 text-amber-400 drop-shadow-lg" />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-100 mb-4 group-hover:text-amber-100 transition-colors">Evidence & Progress</h3>
                <p className="text-slate-300 leading-relaxed flex-grow">
                  Earn investigation points, unlock classified cases, and collect detective badges as you master web forensics.
                </p>
              </motion.div>
            </StaggerItem>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};