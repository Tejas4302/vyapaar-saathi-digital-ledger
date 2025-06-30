
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  language: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signupWithEmail: (email: string, password: string, name: string) => Promise<void>;
  signupWithPhone: (phone: string, name: string) => Promise<void>;
  logout: () => void;
  setLanguage: (language: string) => void;
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
      language: 'english'
    };
    setUser(userData);
    localStorage.setItem('vyapaar_user', JSON.stringify(userData));
  };

  const signupWithEmail = async (email: string, password: string, name: string) => {
    // Simulate signup - replace with actual authentication
    const userData = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      language: 'english'
    };
    setUser(userData);
    localStorage.setItem('vyapaar_user', JSON.stringify(userData));
  };

  const signupWithPhone = async (phone: string, name: string) => {
    // Simulate phone signup - replace with actual authentication
    const userData = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      phone,
      language: 'english'
    };
    setUser(userData);
    localStorage.setItem('vyapaar_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vyapaar_user');
  };

  const setLanguage = (language: string) => {
    if (user) {
      const updatedUser = { ...user, language };
      setUser(updatedUser);
      localStorage.setItem('vyapaar_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signupWithEmail,
      signupWithPhone,
      logout,
      setLanguage
    }}>
      {children}
    </AuthContext.Provider>
  );
};
