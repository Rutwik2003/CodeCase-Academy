import { useState, useEffect } from 'react';

export type Theme = 'dark';
export type ColorScheme = 'detective' | 'hacker' | 'classic';

export interface ThemeConfig {
  theme: Theme;
  colorScheme: ColorScheme;
  enableAnimations: boolean;
  compactMode: boolean;
}

const defaultConfig: ThemeConfig = {
  theme: 'dark',
  colorScheme: 'detective',
  enableAnimations: true,
  compactMode: false,
};

export const useTheme = () => {
  const [config, setConfig] = useState<ThemeConfig>(() => {
    const savedConfig = localStorage.getItem('codecase-theme-config');
    if (savedConfig) {
      try {
        return { ...defaultConfig, ...JSON.parse(savedConfig) };
      } catch {
        return defaultConfig;
      }
    }
    return defaultConfig;
  });

  const [resolvedTheme] = useState<'dark'>('dark');

  useEffect(() => {
    // Save config to localStorage
    localStorage.setItem('codecase-theme-config', JSON.stringify(config));

    // Always use dark theme
    const root = document.documentElement;
    root.className = '';
    
    // Add theme class
    root.classList.add('dark');
    
    // Add color scheme class
    root.classList.add(`scheme-${config.colorScheme}`);
    
    // Add animation preference
    if (!config.enableAnimations) {
      root.classList.add('reduce-motion');
    }
    
    // Add compact mode
    if (config.compactMode) {
      root.classList.add('compact');
    }

    // Apply CSS custom properties for theming
    root.style.setProperty('--theme-transition', config.enableAnimations ? '0.3s ease' : 'none');
    
  }, [config]);

  // No theme toggle needed - always dark
  const toggleTheme = () => {
    // No-op - theme is always dark
  };

  const setTheme = (theme: Theme) => {
    setConfig(prev => ({ ...prev, theme }));
  };

  const setColorScheme = (colorScheme: ColorScheme) => {
    setConfig(prev => ({ ...prev, colorScheme }));
  };

  const toggleAnimations = () => {
    setConfig(prev => ({ ...prev, enableAnimations: !prev.enableAnimations }));
  };

  const toggleCompactMode = () => {
    setConfig(prev => ({ ...prev, compactMode: !prev.compactMode }));
  };

  return { 
    ...config,
    resolvedTheme,
    toggleTheme,
    setTheme,
    setColorScheme,
    toggleAnimations,
    toggleCompactMode,
  };
};