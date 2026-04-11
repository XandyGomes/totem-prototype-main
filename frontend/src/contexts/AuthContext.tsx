'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  id: string;
  nome: string;
  role: 'MEDICO' | 'ADMIN';
  crm?: string;
  especialidade?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedToken = localStorage.getItem('nga_token');
    const storedUser = localStorage.getItem('nga_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User, token: string) => {
    setToken(token);
    setUser(userData);
    localStorage.setItem('nga_token', token);
    localStorage.setItem('nga_user', JSON.stringify(userData));
    
    // Redirecionamento baseado na role
    if (userData.role === 'ADMIN') {
      router.push('/admin');
    } else {
      router.push('/medico');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('nga_token');
    localStorage.removeItem('nga_user');
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
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
