import React, { createContext, useState, useContext, useEffect } from 'react';
import { apiClient, getCurrentUser, logout as apiLogout } from '@/lib/biotechService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  // ============================================================================
  // CHANGED: Replaced checkAppState with simple checkAuth
  // OLD: Checked app public settings, then user auth
  // NEW: Only checks if user is authenticated via /auth/me
  // ============================================================================
  const checkAuth = async () => {
    try {
      setIsLoadingAuth(true);
      setAuthError(null);
      
      const token = localStorage.getItem('bioquery_token');
      
      if (!token) {
        // No token, user not authenticated
        setIsLoadingAuth(false);
        setIsAuthenticated(false);
        return;
      }

      // Call /api/auth/me to verify token and get user
      const currentUser = await getCurrentUser();
      
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        // Token invalid
        setIsAuthenticated(false);
        localStorage.removeItem('bioquery_token');
        localStorage.removeItem('bioquery_user');
      }
      
      setIsLoadingAuth(false);
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
      
      // Clear invalid token
      localStorage.removeItem('bioquery_token');
      localStorage.removeItem('bioquery_user');
      
      // Set error state
      if (error.status === 401) {
        setAuthError({
          type: 'auth_required',
          message: 'Please log in to continue'
        });
      }
    }
  };


  const logout = async (shouldRedirect = true) => {
    try {
      await apiLogout();
      setUser(null);
      setIsAuthenticated(false);
      
      if (shouldRedirect) {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if API call fails
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('bioquery_token');
      localStorage.removeItem('bioquery_user');
      
      if (shouldRedirect) {
        window.location.href = '/login';
      }
    }
  };

 
  const navigateToLogin = () => {
    const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.href = `/login?returnUrl=${returnUrl}`;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      authError,
      logout,
      navigateToLogin,
      checkAuth // Renamed from checkAppState
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};