
import React, { createContext, useContext, useState, useEffect } from 'react';

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
  sendOTP: (emailOrPhone: string) => Promise<{ success: boolean; message: string }>;
  verifyOTP: (emailOrPhone: string, otp: string, name: string) => Promise<{ success: boolean; message: string }>;
  login: (emailOrPhone: string, otp: string) => Promise<{ success: boolean; message: string }>;
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

  const sendOTP = async (emailOrPhone: string) => {
    setIsLoading(true);
    try {
      // Simulate OTP sending - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`OTP sent to ${emailOrPhone}`);
      setIsLoading(false);
      return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
      setIsLoading(false);
      return { success: false, message: 'Failed to send OTP' };
    }
  };

  const verifyOTP = async (emailOrPhone: string, otp: string, name: string) => {
    setIsLoading(true);
    try {
      // Simulate OTP verification - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any 6-digit OTP
      if (otp.length === 6) {
        const userData = {
          id: Math.random().toString(36).substr(2, 9),
          name,
          ...(emailOrPhone.includes('@') ? { email: emailOrPhone } : { phone: emailOrPhone }),
          isVerified: true
        };
        setUser(userData);
        localStorage.setItem('vyapaar_user', JSON.stringify(userData));
        setIsLoading(false);
        return { success: true, message: 'Account created successfully!' };
      } else {
        setIsLoading(false);
        return { success: false, message: 'Invalid OTP' };
      }
    } catch (error) {
      setIsLoading(false);
      return { success: false, message: 'Verification failed' };
    }
  };

  const login = async (emailOrPhone: string, otp: string) => {
    setIsLoading(true);
    try {
      // Simulate login verification - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any 6-digit OTP
      if (otp.length === 6) {
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
        return { success: false, message: 'Invalid OTP' };
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
      sendOTP,
      verifyOTP,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
