
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  storeName?: string;
  profilePhoto?: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signUp: (emailOrPhone: string, password: string, name: string) => Promise<{ success: boolean; message: string }>;
  login: (emailOrPhone: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Clear all existing data to ensure fresh start
    localStorage.clear();
    setIsLoading(false);
  }, []);

  const signUp = async (emailOrPhone: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // Validate mobile number format (exactly 10 digits)
      if (!emailOrPhone.includes('@')) {
        if (!/^[6-9]\d{9}$/.test(emailOrPhone)) {
          setIsLoading(false);
          return { success: false, message: 'Mobile number must be exactly 10 digits starting with 6-9' };
        }
      }

      // Simulate signup
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create unique user ID
      const userId = Math.random().toString(36).substr(2, 9);
      
      const userData = {
        id: userId,
        name,
        ...(emailOrPhone.includes('@') ? { email: emailOrPhone } : { phone: emailOrPhone }),
        isVerified: true
      };
      
      setUser(userData);
      
      // Store user data with unique key
      localStorage.setItem(`vyapaar_user_${userId}`, JSON.stringify(userData));
      localStorage.setItem(`user_credentials_${userId}`, JSON.stringify({ emailOrPhone, password }));
      localStorage.setItem('current_user_id', userId);
      
      setIsLoading(false);
      return { success: true, message: 'Account created successfully!' };
    } catch (error) {
      setIsLoading(false);
      return { success: false, message: 'Failed to create account' };
    }
  };

  const login = async (emailOrPhone: string, password: string) => {
    setIsLoading(true);
    try {
      // Validate mobile number format if not email
      if (!emailOrPhone.includes('@')) {
        if (!/^[6-9]\d{9}$/.test(emailOrPhone)) {
          setIsLoading(false);
          return { success: false, message: 'Mobile number must be exactly 10 digits starting with 6-9' };
        }
      }

      // Simulate login verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check all stored credentials to find matching user
      let foundUser = null;
      let foundUserId = null;
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('user_credentials_')) {
          const userId = key.replace('user_credentials_', '');
          const storedCredentials = localStorage.getItem(key);
          
          if (storedCredentials) {
            const { emailOrPhone: storedEmail, password: storedPassword } = JSON.parse(storedCredentials);
            
            if (emailOrPhone === storedEmail && password === storedPassword) {
              const userData = localStorage.getItem(`vyapaar_user_${userId}`);
              if (userData) {
                foundUser = JSON.parse(userData);
                foundUserId = userId;
                break;
              }
            }
          }
        }
      }
      
      if (foundUser && foundUserId) {
        setUser(foundUser);
        localStorage.setItem('current_user_id', foundUserId);
        setIsLoading(false);
        return { success: true, message: 'Login successful!' };
      } else {
        setIsLoading(false);
        return { success: false, message: 'Invalid credentials or account not found' };
      }
    } catch (error) {
      setIsLoading(false);
      return { success: false, message: 'Login failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('current_user_id');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      signUp,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
