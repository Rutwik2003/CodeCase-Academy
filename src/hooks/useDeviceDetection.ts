import { useEffect, useState } from 'react';

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  userAgent: string;
}

export const useDeviceDetection = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenWidth: 1920,
    userAgent: ''
  });

  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const screenWidth = window.innerWidth;

      // Mobile detection based on user agent
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      const isMobileUA = mobileRegex.test(userAgent);

      // Screen size based detection
      const isMobileScreen = screenWidth < 768;
      const isTabletScreen = screenWidth >= 768 && screenWidth < 1024;
      const isDesktopScreen = screenWidth >= 1024;

      // Combined detection
      const isMobile = isMobileUA || isMobileScreen;
      const isTablet = !isMobile && isTabletScreen;
      const isDesktop = !isMobile && !isTablet && isDesktopScreen;

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        screenWidth,
        userAgent
      });
    };

    // Initial detection
    detectDevice();

    // Listen for resize events
    window.addEventListener('resize', detectDevice);

    return () => {
      window.removeEventListener('resize', detectDevice);
    };
  }, []);

  return deviceInfo;
};

export const getDeviceType = (): string => {
  const userAgent = navigator.userAgent.toLowerCase();
  const screenWidth = window.innerWidth;

  if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent) || screenWidth < 768) {
    return 'mobile';
  } else if (screenWidth >= 768 && screenWidth < 1024) {
    return 'tablet';
  } else {
    return 'desktop';
  }
};

export const isMobileDevice = (): boolean => {
  return getDeviceType() === 'mobile';
};

export const isTabletDevice = (): boolean => {
  return getDeviceType() === 'tablet';
};

export const isDesktopDevice = (): boolean => {
  return getDeviceType() === 'desktop';
};
