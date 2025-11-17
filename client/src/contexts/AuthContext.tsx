import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'wouter';

interface User {
  id: string;
  username: string;
  role: string;
  email?: string;
  name?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  getAuthHeaders: () => Record<string, string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = 'https://globalpulse-news-production-31ee.up.railway.app';

// Token management utilities
const TokenManager = {
  getToken: (): string | null => {
    try {
      return localStorage.getItem('auth_token');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  setToken: (token: string): void => {
    try {
      localStorage.setItem('auth_token', token);
    } catch (error) {
      console.error('Error setting token:', error);
    }
  },

  removeToken: (): void => {
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('token_expiry');
    } catch (error) {
      console.error('Error removing token:', error);
    }
  },

  isTokenExpired: (): boolean => {
    try {
      const expiry = localStorage.getItem('token_expiry');
      if (!expiry) return true;
      return Date.now() > parseInt(expiry);
    } catch (error) {
      return true;
    }
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  const clearError = () => setError(null);

  // Function to get auth headers for API requests
  const getAuthHeaders = (): Record<string, string> => {
    const token = TokenManager.getToken();
    if (!token) {
      return { 'Content-Type': 'application/json' };
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Enhanced token validation
  const validateToken = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  // Check auth status on mount with enhanced security
  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const token = TokenManager.getToken();
      
      if (!token || TokenManager.isTokenExpired()) {
        TokenManager.removeToken();
        setIsAuthenticated(false);
        setCurrentUser(null);
        return;
      }

      // Validate token with backend
      const isValid = await validateToken(token);
      if (!isValid) {
        TokenManager.removeToken();
        setIsAuthenticated(false);
        setCurrentUser(null);
        return;
      }

      // Get user data
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setCurrentUser(userData);
        setIsAuthenticated(true);
        
        // Store user data
        localStorage.setItem('user_data', JSON.stringify(userData));
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      TokenManager.removeToken();
      setIsAuthenticated(false);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Enhanced login with proper error handling and security
  const login = async (username: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      setError(null);

      // Input validation
      if (!username.trim() || !password.trim()) {
        return { success: false, message: 'Please enter both username and password' };
      }

      if (password.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters long' };
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: username.trim(), 
          password: password.trim() 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and set expiry (24 hours)
        TokenManager.setToken(data.token);
        const expiryTime = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
        localStorage.setItem('token_expiry', expiryTime.toString());
        
        setCurrentUser(data.user);
        setIsAuthenticated(true);
        
        // Store user data
        localStorage.setItem('user_data', JSON.stringify(data.user));
        
        return { success: true, message: 'Login successful!' };
      } else {
        const errorMessage = data.message || 'Login failed. Please check your credentials.';
        setError(errorMessage);
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = 'Network error. Please check your connection and try again.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear all auth data
    TokenManager.removeToken();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setError(null);
    setLocation('/');
  };

  // Auto-logout when token expires
  useEffect(() => {
    const checkTokenExpiry = setInterval(() => {
      if (isAuthenticated && TokenManager.isTokenExpired()) {
        logout();
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkTokenExpiry);
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      currentUser, 
      login, 
      logout, 
      loading,
      error,
      clearError,
      getAuthHeaders
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}