import { Outlet } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useWallet } from '../hooks/useWallet';
import { HiSun, HiMoon } from 'react-icons/hi';

const PublicLayout = () => {
  const { isDark, toggleTheme } = useTheme();
  const { connectWallet, isConnecting } = useWallet();

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDark ? 'bg-background-dark' : 'bg-gray-50'
    }`}>
      {/* Minimal Header for Public Pages */}
      <header className="bg-white dark:bg-surface-dark shadow-sm border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className={`text-2xl font-bold ${isDark ? 'text-primary-dark-500' : 'text-primary-500'}`}>
                  TokenStream
                </h1>
              </div>
            </div>

            {/* Right side - Theme toggle and Connect button */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer ${
                  isDark 
                    ? 'text-gray-300 hover:text-primary-dark-500 hover:bg-gray-800 focus:ring-primary-dark-500' 
                    : 'text-gray-600 hover:text-primary-500 hover:bg-gray-100 focus:ring-primary-500'
                }`}
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
              </button>
              
              <span className={`text-sm hidden md:block ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Connect your wallet to get started
              </span>
              
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed cursor-pointer ${
                  isDark 
                    ? 'bg-primary-dark-500 hover:bg-primary-dark-600 disabled:bg-primary-dark-300 text-white' 
                    : 'bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white'
                }`}
              >
                {isConnecting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-1 sm:mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="hidden sm:inline">Connecting...</span>
                    <span className="sm:hidden">...</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Connect Wallet</span>
                    <span className="sm:hidden">Connect</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Page Content */}
      <Outlet />
    </div>
  );
};

export default PublicLayout;
