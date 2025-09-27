import { Outlet } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useWallet } from '../hooks/useWallet';
import { useNavigate, useLocation } from 'react-router-dom';
import { HiSun, HiMoon } from 'react-icons/hi';

const AuthenticatedLayout = () => {
  const { isDark, toggleTheme } = useTheme();
  const { address, disconnectWallet, formatAddress } = useWallet();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen transition-colors duration-200 bg-gray-50 dark:bg-gray-900">
      {/* Full Header for Authenticated Users */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  TokenStream
                </h1>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-4 sm:space-x-8">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer text-gray-600 hover:text-blue-600 hover:bg-gray-100 focus:ring-blue-500 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-700 dark:focus:ring-blue-400"
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
              </button>
              
              {/* Navigation Buttons */}
              <button 
                onClick={() => navigate('/dashboard')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer ${
                  location.pathname === '/dashboard'
                    ? 'bg-blue-600 text-white dark:bg-blue-500'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:ring-blue-500 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-700 dark:focus:ring-blue-400'
                }`}>
                <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Streaming
              </button>
              
              <button 
                onClick={() => navigate('/manage-users')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer ${
                  location.pathname === '/manage-users'
                    ? 'bg-blue-600 text-white dark:bg-blue-500'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:ring-blue-500 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-700 dark:focus:ring-blue-400'
                }`}>
                <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                Manage Users
              </button>
              
              {/* User Info and Logout */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="text-xs sm:text-sm px-2 sm:px-3 py-2 rounded-lg text-gray-600 bg-gray-50 dark:text-gray-300 dark:bg-gray-700">
                  {formatAddress(address)}
                </div>
                <button
                  onClick={disconnectWallet}
                  className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 dark:focus:ring-gray-400"
                >
                  <svg className="w-4 h-4 mr-1 sm:mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="hidden sm:inline">Logout</span>
                  <span className="sm:hidden">Exit</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>
      
      {/* Page Content */}
      <Outlet />
    </div>
  );
};

export default AuthenticatedLayout;
