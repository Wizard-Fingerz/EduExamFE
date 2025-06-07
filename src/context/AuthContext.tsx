import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService, { UserProfile } from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, password2: string, firstName: string, lastName: string, userType: 'student' | 'teacher') => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  user: UserProfile | null;
  isStaff: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  const isStaff = user?.user_type === 'teacher';

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const userProfile = await authService.getProfile();
          setUser(userProfile);
          setIsAuthenticated(true);
        } catch (error) {
          // If token is invalid, clear everything
          authService.logout();
          setIsAuthenticated(false);
          setUser(null);
          navigate('/login');
        }
      } else {
        // Only redirect to login if we're not on the register or forgot-password page
        const path = window.location.pathname;
        if (!path.includes('/register') && !path.includes('/forgot-password')) {
          navigate('/login');
        }
      }
    };

    checkAuth();
  }, [navigate]);

  const register = async (
    email: string,
    password: string,
    password2: string,
    firstName: string,
    lastName: string,
    userType: 'student' | 'teacher'
  ) => {
    try {
      const response = await authService.register({
        email,
        password,
        password2,
        first_name: firstName,
        last_name: lastName,
        user_type: userType,
      });
      
      // After successful registration, log the user in with the generated username
      await login(response.username, password);
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.detail || 'Registration failed');
      }
      throw new Error('Registration failed');
    }
  };

  const login = async (username: string, password: string) => {
    try {
      await authService.login({ username, password });
      const userProfile = await authService.getProfile();
      console.log('User profile after login:', userProfile); // Debug log
      setUser(userProfile);
      setIsAuthenticated(true);
      const isStudent = userProfile.user_type === 'student';
      console.log('Is student?', isStudent); // Debug log
      navigate(isStudent ? '/dashboard' : '/staff-dashboard');
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const resetPassword = async (_email: string) => {
    try {
      // TODO: Implement password reset functionality
      await new Promise(resolve => setTimeout(resolve, 1500));
      return Promise.resolve();
    } catch (error) {
      throw new Error('Password reset failed');
    }
  };

  const logout = () => {
    authService.logout();
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