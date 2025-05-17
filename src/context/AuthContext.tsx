import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  user: User | null;
  isStaff: boolean;
}

interface User {
  email: string;
  name: string;
  role: 'student' | 'staff' | 'admin';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const isStaff = user?.role === 'staff' || user?.role === 'admin';

  // Check if user is already authenticated on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    } else {
      // Only redirect to login if we're not on the register or forgot-password page
      const path = window.location.pathname;
      if (!path.includes('/register') && !path.includes('/forgot-password')) {
        navigate('/login');
      }
    }
  }, [navigate]);

  const register = async (name: string, email: string, _password: string) => {
    try {
      // TODO: Replace with actual API call
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = { email, name, role: 'student' as const };
      const token = 'dummy_token_' + Date.now(); // Generate a unique token
      
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  const login = async (email: string, _password: string) => {
    try {
      // TODO: Replace with actual API call
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, if email contains 'staff' or 'admin', assign that role
      let role: 'student' | 'staff' | 'admin' = 'student';
      if (email.includes('staff')) {
        role = 'staff';
      } else if (email.includes('admin')) {
        role = 'admin';
      }
      
      const user = { email, name: email.split('@')[0], role };
      localStorage.setItem('auth_token', 'dummy_token');
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      setIsAuthenticated(true);
      navigate(role === 'student' ? '/dashboard' : '/staff-dashboard');
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const resetPassword = async (_email: string) => {
    try {
      // TODO: Replace with actual API call
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, this would:
      // 1. Call your backend API to initiate password reset
      // 2. Send a reset link to the user's email
      // 3. Handle the reset token validation
      // 4. Allow the user to set a new password
      
      return Promise.resolve();
    } catch (error) {
      throw new Error('Password reset failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, register, logout, resetPassword, user, isStaff }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 