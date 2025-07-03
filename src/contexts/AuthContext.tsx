
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  name: string;
  phone?: string;
  storeName?: string;
  profilePhoto?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  login: (phoneNumber: string, password: string) => Promise<{ success: boolean; message: string }>;
  signUp: (phoneNumber: string, password: string, name: string, storeName?: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
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
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile when user is authenticated
          setTimeout(async () => {
            await fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          // Clear localStorage when user logs out
          localStorage.removeItem('current_user_id');
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(async () => {
          await fetchUserProfile(session.user.id);
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        const userProfile: UserProfile = {
          id: data.id,
          name: data.name,
          phone: data.phone,
          storeName: data.store_name,
          profilePhoto: data.profile_photo
        };
        setProfile(userProfile);
        // Set user ID in localStorage for DataContext compatibility
        localStorage.setItem('current_user_id', userId);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const login = async (phoneNumber: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    
    try {
      // Convert phone number to email format for Supabase auth
      const email = `${phoneNumber}@temp.com`;
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        return { success: false, message: error.message || 'Login failed' };
      }

      if (data.user) {
        return { success: true, message: 'Login successful' };
      } else {
        return { success: false, message: 'Invalid credentials' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (phoneNumber: string, password: string, name: string, storeName?: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    
    try {
      // Convert phone number to email format for Supabase auth
      const email = `${phoneNumber}@temp.com`;
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name,
            phone: phoneNumber,
            storeName: storeName || ''
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        return { success: false, message: error.message || 'Sign up failed' };
      }

      if (data.user) {
        return { success: true, message: 'Account created successfully' };
      } else {
        return { success: false, message: 'Sign up failed' };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: 'Sign up failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: updates.name || profile.name,
          phone: updates.phone || profile.phone,
          store_name: updates.storeName || profile.storeName,
          profile_photo: updates.profilePhoto || profile.profilePhoto
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }

      // Update local profile state
      setProfile(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile,
      session,
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
