import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { rpcClient } from '../services/rpcClient';

export const WALLET_ADDRESS_KEY = 'wallet_address';

export const useWallet = () => {
  const [address, setAddress] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [networkInfo, setNetworkInfo] = useState(null);
  const [isRpcConnected, setIsRpcConnected] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess, showError, showInfo } = useToast();

  // Check if wallet is already connected on mount and initialize RPC
  useEffect(() => {
    const savedAddress = localStorage.getItem(WALLET_ADDRESS_KEY);
    if (savedAddress) {
      setAddress(savedAddress);
    }
    
    // Initialize RPC client
    initializeRpcClient();
  }, []);

  // Initialize RPC client
  const initializeRpcClient = useCallback(async () => {
    try {
      await rpcClient.initialize(true); // Prefer MetaMask
      setIsRpcConnected(true);
      setNetworkInfo(rpcClient.getNetworkInfo());
      console.log('RPC client initialized with provider:', rpcClient.getProviderType());
    } catch (error) {
      console.error('Failed to initialize RPC client:', error);
      setIsRpcConnected(false);
    }
  }, []);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = useCallback(() => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  }, []);

  // Connect to MetaMask
  const connectWallet = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      setError('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        const walletAddress = accounts[0];
        setAddress(walletAddress);
        localStorage.setItem(WALLET_ADDRESS_KEY, walletAddress);
        
        // Ensure RPC client is connected to MetaMask
        if (!isRpcConnected || !rpcClient.isUsingMetaMask()) {
          try {
            await rpcClient.reconnectToMetaMask();
            setIsRpcConnected(true);
            setNetworkInfo(rpcClient.getNetworkInfo());
          } catch (rpcError) {
            console.warn('RPC client connection failed, but wallet is connected:', rpcError);
          }
        }
        
        // Show success toast and redirect to dashboard
        showSuccess(`Wallet connected successfully!`);
        
        // Only redirect if we're on the homepage
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Error connecting to MetaMask:', err);
      const errorMessage = err.message || 'Failed to connect to MetaMask';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  }, [isMetaMaskInstalled, navigate, location.pathname, showSuccess, showError, isRpcConnected]);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setAddress(null);
    localStorage.removeItem(WALLET_ADDRESS_KEY);
    setError(null);
    
    // Disconnect RPC client
    rpcClient.disconnect();
    setIsRpcConnected(false);
    setNetworkInfo(null);
    
    // Show info toast and redirect to homepage
    showInfo('Wallet disconnected successfully');
    navigate('/home', { replace: true });
  }, [navigate, showInfo]);

  // Format address for display
  const formatAddress = useCallback((addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }, []);

  // Listen for account changes and RPC events
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        // User disconnected their wallet
        setAddress(null);
        localStorage.removeItem(WALLET_ADDRESS_KEY);
        setError(null);
        setIsRpcConnected(false);
        setNetworkInfo(null);
        showInfo('Wallet disconnected from MetaMask');
        navigate('/home', { replace: true });
      } else if (accounts[0] !== address) {
        // User switched accounts
        const newAddress = accounts[0];
        setAddress(newAddress);
        localStorage.setItem(WALLET_ADDRESS_KEY, newAddress);
        showSuccess(`Switched to account: ${newAddress.slice(0, 6)}...${newAddress.slice(-4)}`);
      }
    };

    // Listen for RPC network changes
    const handleNetworkChanged = (event) => {
      setNetworkInfo(event.detail.networkInfo);
      showInfo(`Network changed to: ${event.detail.networkInfo.name}`);
    };

    // Listen for RPC account changes
    const handleRpcAccountChanged = (event) => {
      console.log('RPC account changed:', event.detail.accounts);
    };

    // Listen for RPC disconnection
    const handleRpcDisconnected = () => {
      setIsRpcConnected(false);
      setNetworkInfo(null);
      showError('RPC connection lost');
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.addEventListener('rpc-network-changed', handleNetworkChanged);
    window.addEventListener('rpc-account-changed', handleRpcAccountChanged);
    window.addEventListener('rpc-disconnected', handleRpcDisconnected);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.removeEventListener('rpc-network-changed', handleNetworkChanged);
      window.removeEventListener('rpc-account-changed', handleRpcAccountChanged);
      window.removeEventListener('rpc-disconnected', handleRpcDisconnected);
    };
  }, [address, isMetaMaskInstalled, navigate, showInfo, showSuccess, showError]);

  // Switch network
  const switchNetwork = useCallback(async (chainId) => {
    try {
      if (!isRpcConnected) {
        throw new Error('RPC client not connected');
      }
      
      await rpcClient.switchToConfiguredNetwork();
      setNetworkInfo(rpcClient.getNetworkInfo());
      showSuccess('Network switched successfully');
    } catch (error) {
      console.error('Failed to switch network:', error);
      showError(`Failed to switch network: ${error.message}`);
    }
  }, [isRpcConnected, showSuccess, showError]);

  return {
    address,
    isConnected: !!address,
    isConnecting,
    error,
    networkInfo,
    isRpcConnected,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    formatAddress,
    isMetaMaskInstalled: isMetaMaskInstalled(),
    providerType: rpcClient.getProviderType(),
    initializeRpcClient,
  };
};
