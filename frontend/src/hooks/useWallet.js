import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';

const WALLET_ADDRESS_KEY = 'wallet_address';

export const useWallet = () => {
  const [address, setAddress] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess, showError, showInfo } = useToast();

  // Check if wallet is already connected on mount
  useEffect(() => {
    const savedAddress = localStorage.getItem(WALLET_ADDRESS_KEY);
    if (savedAddress) {
      setAddress(savedAddress);
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
        
        // Show success toast and redirect to dashboard
        showSuccess(`Wallet connected successfully!`);
        
        // Only redirect if we're on the homepage
        if (location.pathname === '/') {
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (err) {
      console.error('Error connecting to MetaMask:', err);
      const errorMessage = err.message || 'Failed to connect to MetaMask';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  }, [isMetaMaskInstalled, navigate, location.pathname, showSuccess, showError]);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setAddress(null);
    localStorage.removeItem(WALLET_ADDRESS_KEY);
    setError(null);
    
    // Show info toast and redirect to homepage
    showInfo('Wallet disconnected successfully');
    navigate('/', { replace: true });
  }, [navigate, showInfo]);

  // Format address for display
  const formatAddress = useCallback((addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        // User disconnected their wallet
        setAddress(null);
        localStorage.removeItem(WALLET_ADDRESS_KEY);
        setError(null);
        showInfo('Wallet disconnected from MetaMask');
        navigate('/', { replace: true });
      } else if (accounts[0] !== address) {
        // User switched accounts
        const newAddress = accounts[0];
        setAddress(newAddress);
        localStorage.setItem(WALLET_ADDRESS_KEY, newAddress);
        showSuccess(`Switched to account: ${newAddress.slice(0, 6)}...${newAddress.slice(-4)}`);
      }
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, [address, isMetaMaskInstalled, navigate, showInfo, showSuccess]);

  return {
    address,
    isConnected: !!address,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    formatAddress,
    isMetaMaskInstalled: isMetaMaskInstalled(),
  };
};
