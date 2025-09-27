import { createContext, useContext, useState } from 'react';

const NavigationContext = createContext();

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('dashboard'); // 'dashboard' or 'manage-users'

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  const value = {
    currentPage,
    navigateTo,
    isDashboard: currentPage === 'dashboard',
    isManageUsers: currentPage === 'manage-users'
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};
