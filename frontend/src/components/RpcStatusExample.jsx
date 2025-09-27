import { useWallet } from '../hooks/useWallet';
import { useUserService } from '../hooks/useUserService';
import { useTheme } from '../contexts/ThemeContext';
import NetworkStatus from './NetworkStatus';
import LoadingSpinner from './LoadingSpinner';

/**
 * Example component showing how to use the MetaMask-integrated RPC system
 */
const RpcStatusExample = () => {
  const { isDark } = useTheme();
  const { 
    address, 
    isConnected, 
    networkInfo, 
    isRpcConnected, 
    providerType,
    switchNetwork 
  } = useWallet();
  
  const { 
    users, 
    loading, 
    error, 
    isServiceReady, 
    fetchUsers, 
    addUser 
  } = useUserService();

  const handleFetchUsers = async () => {
    await fetchUsers();
  };

  const handleAddTestUser = async () => {
    if (!address) return;
    await addUser(address, '100');
  };

  return (
    <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
        RPC Integration Status
      </h3>
      
      {/* Network Status */}
      <div className="mb-4">
        <NetworkStatus />
      </div>

      {/* Connection Status */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className={`p-3 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="text-sm font-medium mb-1">Wallet</div>
          <div className={`text-xs ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>
        
        <div className={`p-3 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="text-sm font-medium mb-1">RPC</div>
          <div className={`text-xs ${isRpcConnected ? 'text-green-500' : 'text-red-500'}`}>
            {isRpcConnected ? `Connected (${providerType})` : 'Disconnected'}
          </div>
        </div>
      </div>

      {/* Network Info */}
      {networkInfo && (
        <div className={`p-3 rounded mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="text-sm font-medium mb-2">Network Details</div>
          <div className="text-xs space-y-1">
            <div>Name: {networkInfo.name || 'Unknown'}</div>
            <div>Chain ID: {networkInfo.chainId?.toString()}</div>
            <div>Provider: {providerType}</div>
          </div>
        </div>
      )}

      {/* Service Status */}
      <div className={`p-3 rounded mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <div className="text-sm font-medium mb-2">Service Status</div>
        <div className={`text-xs ${isServiceReady ? 'text-green-500' : 'text-yellow-500'}`}>
          {isServiceReady ? 'Ready' : 'Initializing...'}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3 rounded mb-4 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700">
          <div className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">Error</div>
          <div className="text-xs text-red-600 dark:text-red-300">{error}</div>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-2">
        <button
          onClick={handleFetchUsers}
          disabled={!isServiceReady || loading}
          className={`w-full px-4 py-2 rounded text-sm font-medium transition-colors ${
            isDark 
              ? 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white'
          } disabled:cursor-not-allowed`}
        >
          {loading ? <LoadingSpinner size="sm" text="" /> : 'Fetch Users from Blockchain'}
        </button>

        <button
          onClick={handleAddTestUser}
          disabled={!isServiceReady || !isConnected || loading}
          className={`w-full px-4 py-2 rounded text-sm font-medium transition-colors ${
            isDark 
              ? 'bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white' 
              : 'bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white'
          } disabled:cursor-not-allowed`}
        >
          Add Test User (100 tokens)
        </button>

        {!isRpcConnected && (
          <button
            onClick={switchNetwork}
            className={`w-full px-4 py-2 rounded text-sm font-medium transition-colors ${
              isDark 
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                : 'bg-yellow-500 hover:bg-yellow-600 text-white'
            }`}
          >
            Reconnect RPC
          </button>
        )}
      </div>

      {/* Users Display */}
      {users.length > 0 && (
        <div className="mt-4">
          <div className="text-sm font-medium mb-2">Users ({users.length})</div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {users.map((user, index) => (
              <div 
                key={user.id || index} 
                className={`text-xs p-2 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}
              >
                <div>Address: {user.address}</div>
                <div>Tokens: {user.tokens}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RpcStatusExample;
