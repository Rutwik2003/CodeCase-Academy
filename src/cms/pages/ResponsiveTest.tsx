import React from 'react';
import { motion } from 'framer-motion';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  CheckCircle, 
  Users, 
  BarChart3, 
  Settings,
  Eye
} from 'lucide-react';

const ResponsiveTest: React.FC = () => {
  const breakpoints = [
    {
      name: 'Mobile',
      icon: Smartphone,
      range: '< 640px',
      color: 'text-blue-400',
      features: ['Sidebar overlay', 'Mobile cards', 'Touch-friendly buttons', 'Compact stats']
    },
    {
      name: 'Tablet',
      icon: Tablet,
      range: '640px - 1024px',
      color: 'text-green-400',
      features: ['Responsive grid', 'Adaptive layout', 'Touch optimized', 'Medium spacing']
    },
    {
      name: 'Desktop',
      icon: Monitor,
      range: '> 1024px',
      color: 'text-purple-400',
      features: ['Full table view', 'Sidebar visible', 'Hover effects', 'Large spacing']
    }
  ];

  const cmsSections = [
    {
      title: 'Dashboard',
      icon: BarChart3,
      improvements: [
        'Stats grid: 1 col → 2 cols → 6 cols',
        'Activity cards stack vertically on mobile',
        'Quick actions use smaller buttons',
        'Text scales: xs → sm → base'
      ]
    },
    {
      title: 'User Management',
      icon: Users,
      improvements: [
        'Desktop: Full table with all columns',
        'Mobile: Card view with essential info',
        'Responsive stats: 2 cols → 4 cols',
        'Touch-friendly action buttons'
      ]
    },
    {
      title: 'Analytics',
      icon: Eye,
      improvements: [
        'Chart containers adapt to screen',
        'Time selector becomes dropdown',
        'Export buttons hide text on mobile',
        'Flexible grid layouts'
      ]
    },
    {
      title: 'Settings',
      icon: Settings,
      improvements: [
        'Form fields stack on mobile',
        'Toggle switches larger for touch',
        'Modal dialogs fit screen',
        'Navigation becomes collapsible'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">CMS Responsive Design Complete</h2>
            <p className="text-white/60">Professional mobile-first design implementation</p>
          </div>
        </div>
        
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-medium">All CMS Pages Now Mobile Responsive</span>
          </div>
          <p className="text-white/80 text-sm">
            The admin dashboard now provides an optimal experience across all device sizes with 
            adaptive layouts, touch-friendly interfaces, and mobile-specific optimizations.
          </p>
        </div>
      </motion.div>

      {/* Breakpoint Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {breakpoints.map((bp, index) => {
          const Icon = bp.icon;
          return (
            <motion.div
              key={bp.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20"
            >
              <div className="flex items-center space-x-3 mb-4">
                <Icon className={`w-8 h-8 ${bp.color}`} />
                <div>
                  <h3 className="text-white font-bold text-lg">{bp.name}</h3>
                  <p className="text-white/60 text-sm">{bp.range}</p>
                </div>
              </div>
              
              <ul className="space-y-2">
                {bp.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-white/80 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>

      {/* CMS Section Improvements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {cmsSections.map((section, index) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg">{section.title}</h3>
              </div>
              
              <ul className="space-y-3">
                {section.improvements.map((improvement, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-white/80 text-sm">{improvement}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>

      {/* Image Asset Fix */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-white font-bold text-lg">Vercel Deployment Image Fix</h3>
        </div>
        
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
          <p className="text-white/80 text-sm mb-3">
            <strong>Issue Resolved:</strong> Vasanth_Profile.jpeg and all other assets are now properly 
            accessible in production by moving them from the root assets/ folder to public/assets/.
          </p>
          
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-medium">
              All images now load correctly on Vercel deployment
            </span>
          </div>
        </div>
      </motion.div>

      {/* Testing Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20"
      >
        <h3 className="text-white font-bold text-lg mb-4">Testing the Responsive Design</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-white font-medium mb-3">Desktop Browser</h4>
            <ol className="space-y-2 text-white/80 text-sm">
              <li>1. Open Chrome DevTools (F12)</li>
              <li>2. Click the device toggle icon</li>
              <li>3. Select various device sizes</li>
              <li>4. Test CMS navigation and functions</li>
            </ol>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-3">Mobile Device</h4>
            <ol className="space-y-2 text-white/80 text-sm">
              <li>1. Access CMS on your phone</li>
              <li>2. Test touch interactions</li>
              <li>3. Verify all content fits screen</li>
              <li>4. Check card vs table layouts</li>
            </ol>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResponsiveTest;
