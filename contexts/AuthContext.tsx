'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { UserModel } from '@/lib/types';
import { AuthService } from '@/services/AuthService';
import { User } from '@/models/User';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface AuthContextType {
  user: FirebaseUser | null;
  userData: UserModel | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserModel>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChanged(async (authUser) => {
      setUser(authUser);
      
      if (authUser) {
        try {
          const user = await User.getById(authUser.uid);
          setUserData(user);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      await AuthService.login({ email, password });
      toast.success('Successfully logged in');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to log in');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, displayName?: string) => {
    try {
      setLoading(true);
      await AuthService.signup({ email, password, displayName });
      toast.success('Successfully signed up');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign up');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await AuthService.logout();
      toast.success('Successfully logged out');
      router.push('/');
    } catch (error: any) {
      toast.error(error.message || 'Failed to log out');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<UserModel>) => {
    try {
      setLoading(true);
      
      if (userData) {
        const updatedUser = await userData.update(data);
        setUserData(updatedUser);
        toast.success('Profile updated successfully');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userData, 
      loading, 
      login, 
      signup, 
      logout, 
      updateProfile 
    }}>
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