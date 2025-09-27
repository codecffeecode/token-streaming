import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/userService';
import { useToast } from '../contexts/ToastContext';

/**
 * Custom hook for user service operations with loading states and error handling
 */
export const useUserService = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { showSuccess, showError } = useToast();

  // Initialize the service
  const initialize = useCallback(async () => {
    if (isInitialized) return;
    
    try {
      setLoading(true);
      setError(null);
      await userService.initialize();
      setIsInitialized(true);
    } catch (err) {
      setError(err.message);
      showError(`Failed to initialize user service: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [isInitialized, showError]);

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await userService.getAllUsers();
      
      if (result.success) {
        setUsers(result.data);
        return result.data;
      } else {
        throw new Error(result.error || result.message);
      }
    } catch (err) {
      setError(err.message);
      showError(`Failed to fetch users: ${err.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Add a new user
  const addUser = useCallback(async (address, tokens) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await userService.addUser(address, tokens);
      
      if (result.success) {
        showSuccess(result.message);
        // Refresh users list
        await fetchUsers();
        return result;
      } else {
        throw new Error(result.error || result.message);
      }
    } catch (err) {
      setError(err.message);
      showError(`Failed to add user: ${err.message}`);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError, fetchUsers]);

  // Remove a user
  const removeUser = useCallback(async (userAddress) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await userService.removeUser(userAddress);
      
      if (result.success) {
        showSuccess(result.message);
        // Refresh users list
        await fetchUsers();
        return result;
      } else {
        throw new Error(result.error || result.message);
      }
    } catch (err) {
      setError(err.message);
      showError(`Failed to remove user: ${err.message}`);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError, fetchUsers]);

  // Withdraw tokens
  const withdrawTokens = useCallback(async (userAddress, amount) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await userService.withdrawTokens(userAddress, amount);
      
      if (result.success) {
        showSuccess(result.message);
        // Refresh users list
        await fetchUsers();
        return result;
      } else {
        throw new Error(result.error || result.message);
      }
    } catch (err) {
      setError(err.message);
      showError(`Failed to withdraw tokens: ${err.message}`);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError, fetchUsers]);

  // Get user streaming data
  const getUserStreamingData = useCallback(async (userAddress) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await userService.getUserStreamingData(userAddress);
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error || result.message);
      }
    } catch (err) {
      setError(err.message);
      showError(`Failed to get streaming data: ${err.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Set contract ABI
  const setContractABI = useCallback((abi) => {
    userService.setContractABI(abi);
  }, []);

  // Initialize on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  return {
    // State
    users,
    loading,
    error,
    isInitialized,
    
    // Actions
    initialize,
    fetchUsers,
    addUser,
    removeUser,
    withdrawTokens,
    getUserStreamingData,
    setContractABI,
    
    // Utilities
    isServiceReady: isInitialized && !loading,
    clearError: () => setError(null),
  };
};
