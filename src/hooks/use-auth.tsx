
"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { useRouter } from 'next/navigation';

// Mock User object that matches Firebase's User type shape
const mockUser: User = {
  uid: 'mock-user-id',
  email: 'mock@user.com',
  displayName: 'Usuário Mock',
  photoURL: null,
  emailVerified: true,
  isAnonymous: false,
  metadata: {
    creationTime: new Date().toISOString(),
    lastSignInTime: new Date().toISOString(),
  },
  providerData: [],
  providerId: 'password',
  tenantId: null,
  delete: () => Promise.resolve(),
  getIdToken: () => Promise.resolve('mock-token'),
  getIdTokenResult: () => Promise.resolve({
    token: 'mock-token',
    expirationTime: new Date().toISOString(),
    authTime: new Date().toISOString(),
    issuedAtTime: new Date().toISOString(),
    signInProvider: 'password',
    signInSecondFactor: null,
    claims: {},
  }),
  reload: () => Promise.resolve(),
  toJSON: () => ({}),
};


interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is "logged in" from a previous session (using localStorage)
    const storedUser = localStorage.getItem('finanzen-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    // Simulate network delay
    await new Promise(res => setTimeout(res, 500));
    setUser(mockUser);
    localStorage.setItem('finanzen-user', JSON.stringify(mockUser));
    setLoading(false);
  };
  
  const loginWithGoogle = async () => {
    // This now behaves the same as regular login
    await login('mock@google.com', 'password');
  };

  const signup = async (email: string, pass: string) => {
     await login(email, pass);
  };

  const logout = async () => {
    setLoading(true);
     await new Promise(res => setTimeout(res, 500));
    setUser(null);
    localStorage.removeItem('finanzen-user');
    setLoading(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, signup, logout }}>
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
