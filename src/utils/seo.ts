/**
 * SEO Utilities for CodeCase Detective Academy
 * Domain: codecase.rutwikdev.com
 */

export interface SEOConfig {
  domain: string;
  url: string;
  siteName: string;
  title: string;
  description: string;
  keywords: string[];
  author: string;
  locale: string;
  images: {
    ogImage: string;
    twitterCard: string;
    logo: string;
    favicon: string;
  };
}

export const seoConfig: SEOConfig = {
  domain: 'codecase.rutwikdev.com',
  url: 'https://codecase.rutwikdev.com',
  siteName: 'CodeCase Detective Academy',
  title: 'CodeCase Detective Academy | Learn HTML & CSS Through Mysteries in India',
  description: '🔍 Master HTML & CSS by solving detective mysteries! Interactive coding education platform for Indian students. Learn web development with AI detective partner. Free coding bootcamp in India.',
  keywords: [
    'HTML tutorial India',
    'CSS learning Hindi',
    'coding bootcamp Mumbai',
    'web development Delhi',
    'programming course Bangalore',
    'JavaScript Chennai',
    'React Hyderabad',
    'coding classes India',
    'learn programming India',
    'interactive coding education',
    'detective coding game',
    'web development tutorial'
  ],
  author: 'CodeCase Academy India',
  locale: 'en_IN',
  images: {
    ogImage: 'https://codecase.rutwikdev.com/og-image.png',
    twitterCard: 'https://codecase.rutwikdev.com/twitter-card.png',
    logo: 'https://codecase.rutwikdev.com/icons/icon-512x512.png',
    favicon: 'https://codecase.rutwikdev.com/favicon.ico'
  }
};

/**
 * Generate dynamic meta tags for specific pages
 */
export const generatePageSEO = (page: {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
  image?: string;
}) => {
  const baseUrl = seoConfig.url;
  const fullUrl = page.path ? `${baseUrl}${page.path}` : baseUrl;
  
  return {
    title: page.title ? `${page.title} | ${seoConfig.siteName}` : seoConfig.title,
    description: page.description || seoConfig.description,
    url: fullUrl,
    keywords: [...seoConfig.keywords, ...(page.keywords || [])],
    image: page.image || seoConfig.images.ogImage,
    structuredData: generateStructuredData(page)
  };
};

/**
 * Generate structured data for specific pages
 */
export const generateStructuredData = (page: {
  title?: string;
  description?: string;
  path?: string;
  type?: 'WebPage' | 'Course' | 'Game' | 'Tutorial';
}) => {
  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': page.type || 'WebPage',
    name: page.title || seoConfig.title,
    description: page.description || seoConfig.description,
    url: page.path ? `${seoConfig.url}${page.path}` : seoConfig.url,
    image: seoConfig.images.logo,
    publisher: {
      '@type': 'Organization',
      name: seoConfig.siteName,
      logo: seoConfig.images.logo
    },
    mainEntity: {
      '@type': 'EducationalOrganization',
      name: seoConfig.siteName,
      url: seoConfig.url
    }
  };

  if (page.type === 'Course') {
    return {
      ...baseStructuredData,
      '@type': 'Course',
      courseMode: 'online',
      educationalLevel: 'Beginner to Intermediate',
      inLanguage: 'en-IN',
      provider: {
        '@type': 'Organization',
        name: seoConfig.siteName
      }
    };
  }

  if (page.type === 'Game') {
    return {
      ...baseStructuredData,
      '@type': 'Game',
      genre: 'Educational',
      gamePlatform: 'Web Browser',
      applicationCategory: 'EducationalApplication'
    };
  }

  return baseStructuredData;
};

/**
 * SEO Meta Tags Component Props
 */
export interface SEOMetaTagsProps {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
  image?: string;
  type?: 'website' | 'article' | 'game';
  noIndex?: boolean;
}

/**
 * Generate meta tags array for React Helmet or similar
 */
export const generateMetaTags = (props: SEOMetaTagsProps) => {
  const seo = generatePageSEO(props);
  
  return [
    // Basic meta tags
    { name: 'title', content: seo.title },
    { name: 'description', content: seo.description },
    { name: 'keywords', content: seo.keywords.join(', ') },
    { name: 'author', content: seoConfig.author },
    { name: 'robots', content: props.noIndex ? 'noindex,nofollow' : 'index,follow' },
    
    // Open Graph
    { property: 'og:type', content: props.type || 'website' },
    { property: 'og:title', content: seo.title },
    { property: 'og:description', content: seo.description },
    { property: 'og:url', content: seo.url },
    { property: 'og:image', content: seo.image },
    { property: 'og:site_name', content: seoConfig.siteName },
    { property: 'og:locale', content: seoConfig.locale },
    
    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: seo.title },
    { name: 'twitter:description', content: seo.description },
    { name: 'twitter:image', content: seo.image },
    { name: 'twitter:url', content: seo.url },
    
    // Additional
    { name: 'theme-color', content: '#0f172a' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }
  ];
};

/**
 * Analytics tracking functions
 */
export const trackPageView = (path: string, title: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: path,
      page_title: title,
      page_location: `${seoConfig.url}${path}`
    });
  }
};

export const trackEvent = (eventName: string, parameters: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      ...parameters,
      send_to: 'GA_MEASUREMENT_ID'
    });
  }
};

/**
 * Page-specific SEO configurations
 */
export const pageConfigs = {
  home: {
    title: 'Learn HTML & CSS Through Detective Mysteries',
    description: '🔍 Master web development by solving coding mysteries! Interactive platform for Indian students with AI guidance.',
    keywords: ['learn coding', 'HTML CSS tutorial', 'interactive education India']
  },
  learn: {
    title: 'Learn Web Development',
    description: 'Start your coding journey with interactive HTML & CSS lessons designed for Indian students.',
    keywords: ['HTML tutorial', 'CSS learning', 'web development course India'],
    type: 'Course' as const
  },
  cases: {
    title: 'Detective Cases - Coding Challenges',
    description: 'Solve real-world coding problems through engaging detective stories and mysteries.',
    keywords: ['coding challenges', 'programming puzzles', 'detective games'],
    type: 'Game' as const
  },
  profile: {
    title: 'Your Detective Profile',
    description: 'Track your progress, achievements, and coding skills development.',
    keywords: ['coding progress', 'achievements', 'learning dashboard']
  }
};

// Global types for Google Analytics
declare global {
  interface Window {
    gtag: {
      (...args: any[]): void;
      q?: any[] | undefined;
    };
  }
}
