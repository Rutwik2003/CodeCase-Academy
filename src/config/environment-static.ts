// 🚨 SECURITY WARNING: This file previously contained hardcoded secrets
// All sensitive data has been moved to environment variables
// Use environment.ts instead of this file

export const environment = {
  // App Configuration
  app: {
    name: 'CodeCase Detective Academy',
    description: 'Learn HTML & CSS by solving detective mysteries in India',
    version: '1.0.0',
    country: 'IN',
    timezone: 'Asia/Kolkata',
    language: 'en-IN',
    currency: 'INR',
    url: import.meta.env.VITE_APP_URL || 'https://codecase.rutwikdev.com',
  },

  // Firebase Configuration - Use environment variables only (primary backend)
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
  },

  // Vercel Deployment Configuration
  vercel: {
    deploymentUrl: import.meta.env.VERCEL_URL || '',
    environment: import.meta.env.VERCEL_ENV || 'development',
    region: import.meta.env.VERCEL_REGION || 'bom1', // Mumbai region for India
    gitCommitSha: import.meta.env.VERCEL_GIT_COMMIT_SHA || '',
    gitBranch: import.meta.env.VERCEL_GIT_COMMIT_REF || '',
  },

  // Analytics & Features
  analytics: {
    id: import.meta.env.VITE_GA_MEASUREMENT_ID || '',
    enabled: import.meta.env.VITE_GOOGLE_ANALYTICS_ENABLED === 'true',
  },
  
  // Security - Never expose secrets in static files
  security: {
    jwtSecret: import.meta.env.VITE_JWT_SECRET || '',
    corsOrigin: import.meta.env.VITE_CORS_ORIGIN || 'https://codecase.rutwikdev.com',
  },

  // Hosting Configuration
  hosting: {
    platform: 'vercel',
    cdn: 'vercel-edge',
    customDomain: 'codecase.rutwikdev.com',
    ssl: true,
  }
};

// Validate that required environment variables are set
const validateConfig = () => {
  const requiredVars = [
    'VITE_APP_URL',
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_PROJECT_ID'
  ];

  const missing = requiredVars.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    logger.error('🚨 SECURITY: Missing required environment variables:', missing, LogCategory.GENERAL);
    logger.error('Please check your Vercel environment variables configuration', LogCategory.GENERAL);
    logger.error('Configure at: https://vercel.com/dashboard → Project → Settings → Environment Variables', LogCategory.GENERAL);
  }

  // Vercel-specific validation
  if (import.meta.env.VERCEL_ENV === 'production' && !import.meta.env.VITE_APP_URL?.includes('codecase.rutwikdev.com')) {
    logger.warn('⚠️ Production deployment should use codecase.rutwikdev.com domain', LogCategory.GENERAL);
  }
};

// Only validate in development
if (import.meta.env.MODE === 'development') {
  validateConfig();
}
