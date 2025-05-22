import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { getCurrentUser, setCurrentUser, clearCurrentUser, getUsers, saveUsers } from '../utils/storage';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUser(user);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      setUser(user);
      setCurrentUser(user);
      setIsAuthenticated(true);
      return { success: true, message: 'Login successful!' };
    }
    
    return { success: false, message: 'Invalid email or password.' };
  };

  const register = async (username: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
    const users = getUsers();
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
      return { success: false, message: 'Email already in use.' };
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      password,
    };
    
    users.push(newUser);
    saveUsers(users);
    setUser(newUser);
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    
    return { success: true, message: 'Registration successful!' };
  };

  const logout = () => {
    setUser(null);
    clearCurrentUser();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};