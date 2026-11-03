import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { storageService } from '../services/storage';

interface AuthContextType {
  currentUser: User;
  allUsers: User[];
  switchUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  hasRole: (roles: UserRole[]) => boolean;
  logout: () => void;
  refreshUsers: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => storageService.getCurrentUser());
  const [allUsers, setAllUsers] = useState<User[]>(() => storageService.getUsers());

  const refreshUsers = () => {
    setAllUsers(storageService.getUsers());
  };

  useEffect(() => {
    storageService.setCurrentUser(currentUser);
  }, [currentUser]);

  const switchUser = (user: User) => {
    setCurrentUser(user);
    storageService.setCurrentUser(user);
  };

  const switchRole = (role: UserRole) => {
    const users = storageService.getUsers();
    const target = users.find((u) => u.role === role) || users[0];
    switchUser(target);
  };

  const hasRole = (roles: UserRole[]) => {
    return roles.includes(currentUser.role);
  };

  const logout = () => {
    const users = storageService.getUsers();
    const touristUser = users.find((u) => u.role === 'tourist') || {
      id: 'usr-guest',
      name: 'Wisatawan Tamu',
      email: 'tamu@wisatapay.demo',
      role: 'tourist' as UserRole,
      status: 'active' as const,
    };
    switchUser(touristUser);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        allUsers,
        switchUser,
        switchRole,
        hasRole,
        logout,
        refreshUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
