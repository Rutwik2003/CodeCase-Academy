import React, { useState, useRef, useEffect, memo } from 'react';
import { motion } from 'framer-motion';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = memo(({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  placeholder,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const [imageSrc, setImageSrc] = useState<string>('');

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px' // Load image 50px before it enters viewport
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  // Load image when in view
  useEffect(() => {
    if (!isInView) return;

    // Check if image is already cached
    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
      onLoad?.();
    };
    
    img.onerror = () => {
      setError(true);
      onError?.();
    };

    img.src = src;
  }, [isInView, src, onLoad, onError]);

  // Generate low-quality placeholder
  const generatePlaceholder = () => {
    if (placeholder) return placeholder;
    
    // Create a simple gradient placeholder based on detective theme
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="${width || 400}" height="${height || 300}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1e293b;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#334155;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)"/>
        <circle cx="50%" cy="50%" r="20" fill="#475569" opacity="0.5"/>
      </svg>
    `)}`;
  };

  if (error) {
    return (
      <div 
        className={`bg-slate-800 flex items-center justify-center text-slate-400 ${className}`}
        style={{ width: width, height: height }}
      >
        <span className="text-xs">Image not found</span>
      </div>
    );
  }

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width: width, height: height }}
    >
      {/* Placeholder */}
      <motion.img
        src={generatePlaceholder()}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        animate={{ opacity: isLoaded ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        style={{ filter: 'blur(2px)' }}
      />
      
      {/* Main Image */}
      <motion.img
        src={imageSrc}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        loading={priority ? "eager" : "lazy"}
        width={width}
        height={height}
        style={{
          imageRendering: 'crisp-edges',
          backfaceVisibility: 'hidden',
          transform: 'translateZ(0)'
        }}
      />
      
      {/* Loading indicator */}
      {!isLoaded && isInView && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-slate-800/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        </motion.div>
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;
