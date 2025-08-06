import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export const useCurrentPage = () => {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState<string>('');

  useEffect(() => {
    const path = location.pathname;
    
    // Determine the current page type
    if (path === '/' || path === '/home') {
      setCurrentPage('homepage');
    } else if (path === '/profile') {
      setCurrentPage('profile');
    } else if (path === '/signin' || path === '/signup') {
      setCurrentPage('auth');
    } else if (path === '/about') {
      setCurrentPage('about');
    } else if (path === '/training') {
      setCurrentPage('training');
    } else if (path.startsWith('/case/')) {
      setCurrentPage('case');
    } else {
      setCurrentPage('other');
    }
  }, [location.pathname]);

  return {
    currentPage,
    isHomepage: currentPage === 'homepage',
    isProfile: currentPage === 'profile',
    isAuth: currentPage === 'auth',
    isCase: currentPage === 'case',
    pathname: location.pathname
  };
};
