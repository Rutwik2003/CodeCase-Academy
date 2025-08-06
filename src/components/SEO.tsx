import { useEffect } from 'react';
import { seoConfig, appConfig, indiaConfig } from '../config/environment';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  article?: {
    author?: string;
    section?: string;
    tags?: string[];
    publishedTime?: string;
    modifiedTime?: string;
  };
}

export function SEO({
  title = `${appConfig.name} | Learn HTML & CSS Through Mysteries`,
  description = appConfig.description,
  keywords = seoConfig.keywords,
  image = seoConfig.ogImageUrl,
  url = '/',
  type = 'website',
  article
}: SEOProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Update basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', seoConfig.author);

    // India-specific meta tags
    updateMetaTag('geo.region', 'IN');
    updateMetaTag('geo.placename', indiaConfig.defaultCity);
    updateMetaTag('language', appConfig.language);

    // Update Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', `${appConfig.url}${image}`, true);
    updateMetaTag('og:url', `${appConfig.url}${url}`, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', appConfig.name, true);
    updateMetaTag('og:locale', 'en_IN', true);

    // Update Twitter tags
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', `${appConfig.url}${image}`);
    updateMetaTag('twitter:site', seoConfig.twitterHandle);
    updateMetaTag('twitter:creator', seoConfig.twitterHandle);

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `${appConfig.url}${url}`;

    // Update article-specific meta tags
    if (type === 'article' && article) {
      if (article.author) updateMetaTag('article:author', article.author, true);
      if (article.section) updateMetaTag('article:section', article.section, true);
      if (article.publishedTime) updateMetaTag('article:published_time', article.publishedTime, true);
      if (article.modifiedTime) updateMetaTag('article:modified_time', article.modifiedTime, true);
      if (article.tags) {
        // Remove existing article:tag meta tags
        const existingTags = document.querySelectorAll('meta[property="article:tag"]');
        existingTags.forEach(tag => tag.remove());
        
        // Add new tags
        article.tags.forEach(tag => {
          const meta = document.createElement('meta');
          meta.setAttribute('property', 'article:tag');
          meta.setAttribute('content', tag);
          document.head.appendChild(meta);
        });
      }
    }

    // Update structured data
    const updateStructuredData = () => {
      let script = document.querySelector('#structured-data') as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.id = 'structured-data';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }

      const structuredData = {
        '@context': 'https://schema.org',
        '@type': type === 'article' ? 'Article' : 'WebPage',
        name: title,
        description: description,
        url: `${appConfig.url}${url}`,
        image: `${appConfig.url}${image}`,
        inLanguage: appConfig.language,
        audience: {
          '@type': 'Audience',
          geographicArea: {
            '@type': 'Country',
            name: 'India'
          }
        },
        ...(type === 'article' && article && {
          author: {
            '@type': 'Person',
            name: article.author || seoConfig.author
          },
          publisher: {
            '@type': 'Organization',
            name: seoConfig.publisher,
            logo: {
              '@type': 'ImageObject',
              url: `${appConfig.url}/icons/icon-512x512.png`
            }
          },
          datePublished: article.publishedTime,
          dateModified: article.modifiedTime || article.publishedTime
        })
      };

      script.textContent = JSON.stringify(structuredData);
    };

    updateStructuredData();
  }, [title, description, keywords, image, url, type, article]);

  return null;
}

// Pre-defined SEO configurations for different pages (India-focused)
export const seoConfigs = {
  home: {
    title: `${appConfig.name} | Learn HTML & CSS Through Mysteries in India`,
    description: `🔍 Master HTML & CSS by solving detective mysteries! Interactive coding education platform for Indian students. Learn web development with AI guidance.`,
    keywords: seoConfig.keywords,
    url: '/'
  },
  learn: {
    title: `Learn Web Development in India | ${appConfig.name}`,
    description: 'Start your coding journey with interactive HTML & CSS tutorials designed for Indian students. Learn through detective mysteries with AI guidance.',
    keywords: 'learn HTML India, learn CSS India, web development tutorial, coding for beginners India, interactive learning',
    url: '/learn'
  },
  profile: {
    title: `My Profile | ${appConfig.name}`,
    description: 'Track your coding progress, view completed missions, and manage your detective academy achievements.',
    keywords: 'coding progress India, user profile, achievements, coding missions completed',
    url: '/profile'
  },
  cases: {
    title: `Detective Cases | ${appConfig.name} Coding Missions`,
    description: 'Explore detective coding cases designed for Indian students. Solve mysteries while learning HTML, CSS, and JavaScript.',
    keywords: 'coding challenges India, detective cases, HTML missions, CSS puzzles, JavaScript mysteries',
    url: '/cases'
  },
  mission1: {
    title: `Mission 1: The Broken Website | ${appConfig.name}`,
    description: 'Your first detective case! Fix a broken website by correcting HTML and CSS errors. Perfect for beginners in India.',
    keywords: 'HTML debugging India, CSS fixes, broken website repair, coding mission 1, web development debugging',
    url: '/case/mission1',
    type: 'article' as const,
    article: {
      author: seoConfig.author,
      section: 'Coding Missions',
      tags: ['HTML', 'CSS', 'Debugging', 'Mission', 'India'],
      publishedTime: '2025-01-01T00:00:00Z'
    }
  },
  mission2: {
    title: `Mission 2: The CSS Conspiracy | ${appConfig.name}`,
    description: 'Dive deeper into CSS styling mysteries. Master responsive design techniques popular in Indian web development.',
    keywords: 'CSS styling India, layout fixes, responsive design, CSS mission, web styling challenges',
    url: '/case/mission2',
    type: 'article' as const,
    article: {
      author: seoConfig.author,
      section: 'Coding Missions',
      tags: ['CSS', 'Styling', 'Layout', 'Mission', 'India'],
      publishedTime: '2025-01-01T00:00:00Z'
    }
  },
  vanishingBlogger: {
    title: `The Vanishing Blogger Mystery | ${appConfig.name} Advanced Case`,
    description: 'Advanced detective case for experienced coders in India. Master complex HTML, CSS, and JavaScript techniques.',
    keywords: 'advanced coding India, JavaScript mystery, complex web development, challenging coding case',
    url: '/case/vanishing-blogger',
    type: 'article' as const,
    article: {
      author: seoConfig.author,
      section: 'Advanced Cases',
      tags: ['JavaScript', 'Advanced', 'Mystery', 'Investigation', 'India'],
      publishedTime: '2025-01-01T00:00:00Z'
    }
  }
};
