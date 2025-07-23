import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/axios';
import axios from 'axios';

interface User {
  _id: string;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

const checkAuth = async () => {
    try {
      console.log('Checking authentication status...');
      const response = await api.get('/me');
      console.log('Auth check successful:', response.data);
      setUser(response.data.user);
    } catch (error) {
      console.warn('Auth check failed:', axios.isAxiosError(error) 
        ? `${error.response?.status} ${error.response?.data?.error || ''}` 
        : error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login...');
      const response = await api.post('/login', {
        username: email,
        password
      });
      
      console.log('Login successful, user data:', response.data);
      
      if (!response.data.user) {
        console.error('Login response missing user data:', response.data);
        throw new Error('Invalid login response format');
      }
      
      setUser(response.data.user);
      
      // Immediately verify the session is working
      await checkAuth();
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

const logout = async () => {
    try {
      console.log('Logging out...');
      await api.get('/logout');
      console.log('Logout API call successful');
    } catch (error) {
      console.warn('Logout API call failed:', error);
      // Even if logout fails on server, clear local state
    } finally {
      setUser(null);
      console.log('User state cleared');
    }
  };

useEffect(() => {
    // On initial load, check authentication status
    console.log('AuthContext mounted, checking authentication...');
    checkAuth();
    
    // Set up an interval to periodically check auth status (every 30 minutes)
    const intervalId = setInterval(() => {
      console.log('Periodic auth check...');
      checkAuth();
    }, 30 * 60 * 1000); // Changed from 5 minutes to 30 minutes
    
    return () => clearInterval(intervalId);
  }, []);

  const value = {
    user,
    loading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
