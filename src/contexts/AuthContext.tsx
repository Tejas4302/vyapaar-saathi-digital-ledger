
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
  login: (emailOrPhone: string, password: string) => Promise<{ success: boolean; message: string }>;
  signUp: (emailOrPhone: string, password: string, name: string, storeName?: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('vyapaar_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (emailOrPhone: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    
    try {
      // Get existing users
      const existingUsers = JSON.parse(localStorage.getItem('vyapaar_users') || '[]');
      
      // Find user by email or phone
      const foundUser = existingUsers.find((u: any) => 
        (u.email === emailOrPhone || u.phone === emailOrPhone) && u.password === password
      );

      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('vyapaar_user', JSON.stringify(userWithoutPassword));
        return { success: true, message: 'Login successful' };
      } else {
        return { success: false, message: 'Invalid credentials' };
      }
    } catch (error) {
      return { success: false, message: 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (emailOrPhone: string, password: string, name: string, storeName?: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    
    try {
      // Get existing users
      const existingUsers = JSON.parse(localStorage.getItem('vyapaar_users') || '[]');
      
      // Check if user already exists
      const userExists = existingUsers.some((u: any) => u.email === emailOrPhone || u.phone === emailOrPhone);
      
      if (userExists) {
        return { success: false, message: 'User already exists' };
      }

      // Create new user
      const newUser = {
        id: `user_${Date.now()}`,
        name,
        storeName: storeName || '',
        password,
        ...(emailOrPhone.includes('@') ? { email: emailOrPhone } : { phone: emailOrPhone })
      };

      // Save to users array
      existingUsers.push(newUser);
      localStorage.setItem('vyapaar_users', JSON.stringify(existingUsers));

      // Set current user (without password)
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('vyapaar_user', JSON.stringify(userWithoutPassword));

      return { success: true, message: 'Account created successfully' };
    } catch (error) {
      return { success: false, message: 'Sign up failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vyapaar_user');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('vyapaar_user', JSON.stringify(updatedUser));
      
      // Also update in users array
      const existingUsers = JSON.parse(localStorage.getItem('vyapaar_users') || '[]');
      const userIndex = existingUsers.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        existingUsers[userIndex] = { ...existingUsers[userIndex], ...updates };
        localStorage.setItem('vyapaar_users', JSON.stringify(existingUsers));
      }
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signUp, 
      logout, 
      updateProfile,
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
