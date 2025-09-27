import { useWallet } from '../hooks/useWallet';
import { useTheme } from '../contexts/ThemeContext';
import { HiWifi, HiExclamationTriangle, HiCheckCircle } from 'react-icons/hi';

const NetworkStatus = ({ className = '' }) => {
  const { networkInfo, isRpcConnected, providerType, switchNetwork } = useWallet();
  const { isDark } = useTheme();

  if (!networkInfo) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <HiExclamationTriangle className={`w-4 h-4 ${isDark ? 'text-yellow-400' : 'text-yellow-500'}`} />
        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          No network connection
        </span>
      </div>
    );
  }

  const getNetworkColor = () => {
    if (!isRpcConnected) return isDark ? 'text-red-400' : 'text-red-500';
    return isDark ? 'text-green-400' : 'text-green-500';
  };

  const getNetworkIcon = () => {
    if (!isRpcConnected) return HiExclamationTriangle;
    return HiCheckCircle;
  };

  const NetworkIcon = getNetworkIcon();

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <NetworkIcon className={`w-4 h-4 ${getNetworkColor()}`} />
      <div className="flex flex-col">
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
            {networkInfo.name || `Chain ${networkInfo.chainId}`}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
          }`}>
            {providerType}
          </span>
        </div>
        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Chain ID: {networkInfo.chainId.toString()}
        </span>
      </div>
      
      {!isRpcConnected && (
        <button
          onClick={() => switchNetwork()}
          className={`text-xs px-2 py-1 rounded transition-colors ${
            isDark 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          Reconnect
        </button>
      )}
    </div>
  );
};

export default NetworkStatus;
