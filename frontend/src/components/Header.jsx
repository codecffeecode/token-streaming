import { useWallet } from '../hooks/useWallet';

const Header = () => {
  const { address, isConnected, disconnectWallet, formatAddress } = useWallet();

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary-500">
                TokenStream
              </h1>
            </div>
          </div>

          {/* Navigation */}
          {isConnected ? (
            <nav className="flex items-center space-x-8">
              <button className="text-gray-700 hover:text-primary-500 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                Streaming
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                  {formatAddress(address)}
                </div>
                <button
                  onClick={disconnectWallet}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            </nav>
          ) : (
            <div className="text-sm text-gray-500">
              Connect your wallet to get started
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
