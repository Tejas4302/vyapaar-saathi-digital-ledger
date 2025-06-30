
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  storeName?: string;
  profilePhoto?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signupWithEmail: (email: string, password: string, name: string) => Promise<void>;
  signupWithPhone: (phone: string, name: string) => Promise<void>;
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

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem('vyapaar_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate login - replace with actual authentication
    const userData = {
      id: '1',
      name: 'Shop Owner',
      email,
      storeName: 'My Store'
    };
    setUser(userData);
    localStorage.setItem('vyapaar_user', JSON.stringify(userData));
  };

  const signupWithEmail = async (email: string, password: string, name: string) => {
    // Simulate signup - replace with actual authentication
    const userData = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email
    };
    setUser(userData);
    localStorage.setItem('vyapaar_user', JSON.stringify(userData));
  };

  const signupWithPhone = async (phone: string, name: string) => {
    // Simulate phone signup - replace with actual authentication
    const userData = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      phone
    };
    setUser(userData);
    localStorage.setItem('vyapaar_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vyapaar_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signupWithEmail,
      signupWithPhone,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
