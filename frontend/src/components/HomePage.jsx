import { useWallet } from '../hooks/useWallet';
import { useTheme } from '../contexts/ThemeContext';

const HomePage = () => {
  const { connectWallet, isConnecting, error, isMetaMaskInstalled } = useWallet();
  const { isDark } = useTheme();

  return (
    <div className="flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${
            isDark ? 'text-gray-100' : 'text-gray-900'
          }`}>
            Welcome to{' '}
            <span className={isDark ? 'text-primary-dark-500' : 'text-primary-500'}>
              TokenStream
            </span>
          </h1>
          
          <p className={`text-xl md:text-2xl mb-8 leading-relaxed max-w-3xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            The revolutionary platform for streaming employee salaries with recurring receipt concepts on the blockchain
          </p>
          
          <div className={`rounded-2xl shadow-xl p-8 md:p-12 mb-12 ${
            isDark ? 'bg-surface-dark' : 'bg-white'
          }`}>
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  isDark ? 'bg-primary-dark-900' : 'bg-primary-100'
                }`}>
                  <svg className={`w-8 h-8 ${
                    isDark ? 'text-primary-dark-500' : 'text-primary-500'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${
                  isDark ? 'text-gray-100' : 'text-gray-900'
                }`}>Real-time Streaming</h3>
                <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                  Stream salaries in real-time with transparent blockchain technology
                </p>
              </div>
              
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  isDark ? 'bg-primary-dark-900' : 'bg-primary-100'
                }`}>
                  <svg className={`w-8 h-8 ${
                    isDark ? 'text-primary-dark-500' : 'text-primary-500'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${
                  isDark ? 'text-gray-100' : 'text-gray-900'
                }`}>Recurring Receipts</h3>
                <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                  Automated receipt generation for every payment cycle
                </p>
              </div>
              
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  isDark ? 'bg-primary-dark-900' : 'bg-primary-100'
                }`}>
                  <svg className={`w-8 h-8 ${
                    isDark ? 'text-primary-dark-500' : 'text-primary-500'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${
                  isDark ? 'text-gray-100' : 'text-gray-900'
                }`}>Blockchain Security</h3>
                <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                  Secure, transparent, and immutable payment records
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Connect Wallet Section */}
        <div className={`rounded-2xl shadow-xl p-8 md:p-12 ${
          isDark ? 'bg-surface-dark' : 'bg-white'
        }`}>
          <h2 className={`text-3xl font-bold mb-6 ${
            isDark ? 'text-gray-100' : 'text-gray-900'
          }`}>
            Get Started Today
          </h2>
          
          <p className={`text-lg mb-8 ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Connect your MetaMask wallet to start streaming payments and managing your salary receipts on the blockchain
          </p>

          {error && (
            <div className={`border rounded-lg p-4 mb-6 ${
              isDark 
                ? 'bg-red-900/20 border-red-800' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex">
                <svg className={`w-5 h-5 mt-0.5 mr-3 ${
                  isDark ? 'text-red-400' : 'text-red-400'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className={isDark ? 'text-red-300' : 'text-red-700'}>{error}</p>
              </div>
            </div>
          )}

          {!isMetaMaskInstalled ? (
            <div className="text-center">
              <p className={`mb-6 ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>MetaMask is required to use this application</p>
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center px-8 py-4 font-semibold rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl cursor-pointer ${
                  isDark 
                    ? 'bg-primary-dark-500 hover:bg-primary-dark-600 text-white' 
                    : 'bg-primary-500 hover:bg-primary-600 text-white'
                }`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Install MetaMask
              </a>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className={`inline-flex items-center px-8 py-4 font-semibold rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed cursor-pointer ${
                isDark 
                  ? 'bg-primary-dark-500 hover:bg-primary-dark-600 disabled:bg-primary-dark-300 text-white' 
                  : 'bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white'
              }`}
            >
              {isConnecting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connecting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Connect MetaMask
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
