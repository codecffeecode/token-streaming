import { ethers } from 'ethers';
import { blockchainService } from './blockchainService.js';
import { rpcClient } from './rpcClient.js';
import { CONTRACT_ADDRESSES, API_CONFIG } from '../config/rpc.js';

// Real RPC service for user management and token streaming
class UserService {
  constructor() {
    this.isInitialized = false;
    this.contractABI = null; // You'll need to provide your contract ABI
  }

  /**
   * Initialize the service
   */
  async initialize() {
    try {
      await blockchainService.initialize();
      this.isInitialized = true;
      console.log('UserService initialized successfully');
    } catch (error) {
      console.error('Failed to initialize UserService:', error);
      throw error;
    }
  }

  // Format tokens to 18 decimals using ethers
  formatTokens(amount) {
    try {
      return ethers.formatEther(ethers.parseEther(amount.toString()));
    } catch (error) {
      console.error('Error formatting tokens:', error);
      return '0.0';
    }
  }

  // Parse tokens from 18 decimals
  parseTokens(amount) {
    try {
      return ethers.parseEther(amount.toString());
    } catch (error) {
      console.error('Error parsing tokens:', error);
      return ethers.parseEther('0');
    }
  }

  // Add user with tokens (Real RPC call)
  async addUser(address, tokens) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Validate address
      if (!ethers.isAddress(address)) {
        throw new Error('Invalid Ethereum address');
      }

      // If you have a smart contract for user management
      if (CONTRACT_ADDRESSES.TOKEN_STREAMING && this.contractABI) {
        const tx = await blockchainService.executeContractTransaction(
          CONTRACT_ADDRESSES.TOKEN_STREAMING,
          this.contractABI,
          'addUser', // Replace with your actual contract method name
          [address, this.parseTokens(tokens)]
        );

        // Wait for confirmation
        const receipt = await blockchainService.waitForTransactionConfirmation(tx.hash);
        
        const newUser = {
          id: Date.now(),
          address,
          tokens: this.formatTokens(tokens),
          rawTokens: tokens,
          timestamp: new Date().toISOString(),
          txHash: tx.hash,
          blockNumber: receipt.blockNumber
        };

        return {
          success: true,
          data: newUser,
          message: 'User added successfully',
          txHash: tx.hash
        };
      } else {
        // Fallback to API call if no smart contract
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address,
            tokens: tokens.toString(),
            timestamp: new Date().toISOString()
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return {
          success: true,
          data: result,
          message: 'User added successfully'
        };
      }
    } catch (error) {
      console.error('Failed to add user:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to add user'
      };
    }
  }

  // Get all users from RPC/API
  async getAllUsers() {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // If you have a smart contract for user management
      if (CONTRACT_ADDRESSES.TOKEN_STREAMING && this.contractABI) {
        // Get users from smart contract events or state
        const users = await blockchainService.callContractMethod(
          CONTRACT_ADDRESSES.TOKEN_STREAMING,
          this.contractABI,
          'getAllUsers' // Replace with your actual contract method name
        );

        // Format the data
        const formattedUsers = users.map((user, index) => ({
          id: index + 1,
          address: user.address || user[0],
          tokens: this.formatTokens(user.tokens || user[1]),
          rawTokens: user.tokens || user[1],
          timestamp: user.timestamp ? new Date(user.timestamp * 1000).toISOString() : new Date().toISOString()
        }));

        return {
          success: true,
          data: formattedUsers,
          message: 'Users fetched successfully'
        };
      } else {
        // Fallback to API call
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const users = await response.json();
        return {
          success: true,
          data: users,
          message: 'Users fetched successfully'
        };
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to fetch users'
      };
    }
  }

  // Withdraw tokens for a user (Real RPC call)
  async withdrawTokens(userAddress, amount) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Validate address
      if (!ethers.isAddress(userAddress)) {
        throw new Error('Invalid Ethereum address');
      }

      // If you have a smart contract for token streaming
      if (CONTRACT_ADDRESSES.TOKEN_STREAMING && this.contractABI) {
        // Check current balance first
        const currentBalance = await blockchainService.callContractMethod(
          CONTRACT_ADDRESSES.TOKEN_STREAMING,
          this.contractABI,
          'getBalance', // Replace with your actual contract method name
          [userAddress]
        );

        const withdrawAmount = this.parseTokens(amount);
        if (withdrawAmount > currentBalance) {
          throw new Error('Insufficient tokens');
        }

        // Execute withdrawal transaction
        const tx = await blockchainService.executeContractTransaction(
          CONTRACT_ADDRESSES.TOKEN_STREAMING,
          this.contractABI,
          'withdrawTokens', // Replace with your actual contract method name
          [userAddress, withdrawAmount]
        );

        // Wait for confirmation
        const receipt = await blockchainService.waitForTransactionConfirmation(tx.hash);
        
        const remainingTokens = currentBalance - withdrawAmount;

        return {
          success: true,
          data: {
            userAddress,
            withdrawnAmount: this.formatTokens(withdrawAmount),
            remainingTokens: this.formatTokens(remainingTokens),
            txHash: tx.hash,
            blockNumber: receipt.blockNumber
          },
          message: 'Tokens withdrawn successfully',
          txHash: tx.hash
        };
      } else {
        // Fallback to API call
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS}/withdraw`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userAddress,
            amount: amount.toString()
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return {
          success: true,
          data: result,
          message: 'Tokens withdrawn successfully'
        };
      }
    } catch (error) {
      console.error('Failed to withdraw tokens:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to withdraw tokens'
      };
    }
  }

  // Remove user completely (Real RPC call)
  async removeUser(userAddress) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Validate address
      if (!ethers.isAddress(userAddress)) {
        throw new Error('Invalid Ethereum address');
      }

      // If you have a smart contract for user management
      if (CONTRACT_ADDRESSES.TOKEN_STREAMING && this.contractABI) {
        // Execute removal transaction
        const tx = await blockchainService.executeContractTransaction(
          CONTRACT_ADDRESSES.TOKEN_STREAMING,
          this.contractABI,
          'removeUser', // Replace with your actual contract method name
          [userAddress]
        );

        // Wait for confirmation
        const receipt = await blockchainService.waitForTransactionConfirmation(tx.hash);

        return {
          success: true,
          data: {
            userAddress,
            txHash: tx.hash,
            blockNumber: receipt.blockNumber
          },
          message: 'User removed successfully',
          txHash: tx.hash
        };
      } else {
        // Fallback to API call
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS}/${userAddress}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return {
          success: true,
          data: result,
          message: 'User removed successfully'
        };
      }
    } catch (error) {
      console.error('Failed to remove user:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to remove user'
      };
    }
  }

  /**
   * Get user streaming data
   */
  async getUserStreamingData(userAddress) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      if (!ethers.isAddress(userAddress)) {
        throw new Error('Invalid Ethereum address');
      }

      if (CONTRACT_ADDRESSES.TOKEN_STREAMING && this.contractABI) {
        const [balance, streamRate, lastClaimed] = await Promise.all([
          blockchainService.callContractMethod(
            CONTRACT_ADDRESSES.TOKEN_STREAMING,
            this.contractABI,
            'getBalance',
            [userAddress]
          ),
          blockchainService.callContractMethod(
            CONTRACT_ADDRESSES.TOKEN_STREAMING,
            this.contractABI,
            'getStreamRate',
            [userAddress]
          ),
          blockchainService.callContractMethod(
            CONTRACT_ADDRESSES.TOKEN_STREAMING,
            this.contractABI,
            'getLastClaimed',
            [userAddress]
          )
        ]);

        return {
          success: true,
          data: {
            address: userAddress,
            balance: this.formatTokens(balance),
            streamRate: this.formatTokens(streamRate),
            lastClaimed: new Date(lastClaimed * 1000).toISOString(),
            rawBalance: balance,
            rawStreamRate: streamRate
          },
          message: 'User streaming data fetched successfully'
        };
      } else {
        // Fallback to API call
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS}/${userAddress}/streaming`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return {
          success: true,
          data,
          message: 'User streaming data fetched successfully'
        };
      }
    } catch (error) {
      console.error('Failed to get user streaming data:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to get user streaming data'
      };
    }
  }

  /**
   * Set contract ABI for smart contract interactions
   */
  setContractABI(abi) {
    this.contractABI = abi;
  }

  /**
   * Check if service is initialized
   */
  isServiceInitialized() {
    return this.isInitialized && blockchainService.isServiceInitialized();
  }
}

// Export singleton instance
export const userService = new UserService();
export default userService;

