
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
  signUp: (emailOrPhone: string, password: string, name: string) => Promise<{ success: boolean; message: string; needsVerification?: boolean }>;
  verifyOTP: (emailOrPhone: string, otp: string) => Promise<{ success: boolean; message: string }>;
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
    // Check for stored user data
    const storedUser = localStorage.getItem('vyapaar_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const signUp = async (emailOrPhone: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // For demo purposes, simulate signup with OTP verification required
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store pending user data for OTP verification
      const pendingUser = { emailOrPhone, password, name };
      localStorage.setItem('pending_user', JSON.stringify(pendingUser));
      
      console.log(`OTP sent to ${emailOrPhone} for verification`);
      setIsLoading(false);
      return { success: true, message: 'OTP sent to your email/phone for verification', needsVerification: true };
    } catch (error) {
      setIsLoading(false);
      return { success: false, message: 'Failed to create account' };
    }
  };

  const verifyOTP = async (emailOrPhone: string, otp: string) => {
    setIsLoading(true);
    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any 6-digit OTP
      if (otp.length === 6) {
        const pendingUserData = localStorage.getItem('pending_user');
        if (pendingUserData) {
          const { password, name } = JSON.parse(pendingUserData);
          
          const userData = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            ...(emailOrPhone.includes('@') ? { email: emailOrPhone } : { phone: emailOrPhone }),
            isVerified: true
          };
          
          setUser(userData);
          localStorage.setItem('vyapaar_user', JSON.stringify(userData));
          localStorage.setItem('user_credentials', JSON.stringify({ emailOrPhone, password }));
          localStorage.removeItem('pending_user');
          
          setIsLoading(false);
          return { success: true, message: 'Account verified successfully!' };
        } else {
          setIsLoading(false);
          return { success: false, message: 'Verification session expired' };
        }
      } else {
        setIsLoading(false);
        return { success: false, message: 'Invalid OTP' };
      }
    } catch (error) {
      setIsLoading(false);
      return { success: false, message: 'Verification failed' };
    }
  };

  const login = async (emailOrPhone: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate login verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check stored credentials for demo
      const storedCredentials = localStorage.getItem('user_credentials');
      if (storedCredentials) {
        const { emailOrPhone: storedEmail, password: storedPassword } = JSON.parse(storedCredentials);
        
        if (emailOrPhone === storedEmail && password === storedPassword) {
          const userData = {
            id: '1',
            name: 'Shop Owner',
            ...(emailOrPhone.includes('@') ? { email: emailOrPhone } : { phone: emailOrPhone }),
            storeName: 'My Store',
            isVerified: true
          };
          setUser(userData);
          localStorage.setItem('vyapaar_user', JSON.stringify(userData));
          setIsLoading(false);
          return { success: true, message: 'Login successful!' };
        } else {
          setIsLoading(false);
          return { success: false, message: 'Invalid credentials' };
        }
      } else {
        setIsLoading(false);
        return { success: false, message: 'No account found. Please sign up first.' };
      }
    } catch (error) {
      setIsLoading(false);
      return { success: false, message: 'Login failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vyapaar_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      signUp,
      verifyOTP,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
