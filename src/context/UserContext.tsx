import React, { createContext, useContext, useState } from 'react';
import { mockUsers, type User } from '../data/mockData';

interface UserContextType {
  currentUser: User;
  switchUser: (userId: string) => void;
  allUsers: User[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('current_user_id');
    const found = mockUsers.find((u) => u.id === saved);
    return found || mockUsers[1]; // За замовчуванням Марія (u2)
  });

  const switchUser = (userId: string) => {
    const targetUser = mockUsers.find((u) => u.id === userId);
    if (targetUser) {
      setCurrentUser(targetUser);
      localStorage.setItem('current_user_id', targetUser.id);
    }
  };

  return (
    <UserContext.Provider value={{ currentUser, switchUser, allUsers: mockUsers }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};