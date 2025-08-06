import { useEffect } from 'react';
import { analyticsConfig, isDevelopment } from '../config/environment';
import { logger, LogCategory } from './logger';

// Google Analytics configuration from environment
const GA_TRACKING_ID = analyticsConfig.gaTrackingId;
const ANALYTICS_ENABLED = analyticsConfig.enabled;

// Type declaration for gtag
declare global {
  interface Window {
    gtag: {
      (...args: any[]): void;
      q?: any[];
    };
    dataLayer: any[];
  }
}

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== 'undefined' && ANALYTICS_ENABLED && GA_TRACKING_ID !== 'G-XXXXXXXXXX' && GA_TRACKING_ID && GA_TRACKING_ID.startsWith('G-')) {
    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    
    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    script.onerror = (_error) => {
      // logger.warn('Failed to load Google Analytics script:', _error, LogCategory.UTILITY); // COMMENTED FOR PRODUCTION
    };
    document.head.appendChild(script);

    // Initialize gtag
    window.gtag = window.gtag || function() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
      // India-specific configuration
      country: 'IN',
      language: 'en-IN',
      currency: 'INR'
    });

    if (isDevelopment) {
      // logger.info('📊 Google Analytics initialized for India with ID:', GA_TRACKING_ID, LogCategory.UTILITY); // COMMENTED FOR PRODUCTION
    }
  } else if (isDevelopment) {
    // logger.info('📊 Google Analytics disabled or not configured', LogCategory.UTILITY); // COMMENTED FOR PRODUCTION
  }
};

// Track page views
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag && ANALYTICS_ENABLED) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
      page_title: title || document.title,
      country: 'IN'
    });
  }
};

// Track custom events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag && ANALYTICS_ENABLED) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      country: 'IN'
    });
  }
};

// Predefined event trackers for CodeCase (India-specific)
export const trackCaseStart = (caseId: string) => {
  trackEvent('case_start', 'engagement', `${caseId}_india`);
};

export const trackCaseComplete = (caseId: string, timeSpent?: number) => {
  trackEvent('case_complete', 'engagement', `${caseId}_india`, timeSpent);
};

export const trackHintUsed = (caseId: string) => {
  trackEvent('hint_used', 'engagement', `${caseId}_india`);
};

export const trackCodeSubmission = (caseId: string, success: boolean) => {
  trackEvent('code_submission', 'engagement', `${caseId}_${success ? 'success' : 'failure'}_india`);
};

export const trackUserRegistration = (method: string) => {
  trackEvent('sign_up', 'user_engagement', `${method}_india`);
};

export const trackUserLogin = (method: string) => {
  trackEvent('login', 'user_engagement', `${method}_india`);
};

// India-specific tracking events
export const trackLanguageChange = (language: string) => {
  trackEvent('language_change', 'localization', `to_${language}_india`);
};

export const trackRegionalFeature = (feature: string) => {
  trackEvent('regional_feature', 'localization', `${feature}_india`);
};

export const trackCurrencyDisplay = () => {
  trackEvent('currency_display', 'localization', 'inr_india');
};

// Google Analytics component for React
export function GoogleAnalytics() {
  useEffect(() => {
    initGA();
  }, []);

  return null;
}
