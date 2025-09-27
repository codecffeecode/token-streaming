import { ethers } from 'ethers';
import { rpcClient } from './rpcClient.js';
import { CONTRACT_ADDRESSES } from '../config/rpc.js';

/**
 * Blockchain service for smart contract interactions
 */
class BlockchainService {
  constructor() {
    this.contracts = {};
    this.isInitialized = false;
  }

  /**
   * Initialize the blockchain service
   */
  async initialize() {
    try {
      await rpcClient.initialize();
      this.isInitialized = true;
      console.log('Blockchain service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize blockchain service:', error);
      throw error;
    }
  }

  /**
   * Get contract instance
   */
  getContract(contractAddress, abi) {
    if (!contractAddress || !abi) {
      throw new Error('Contract address and ABI are required');
    }

    const provider = rpcClient.getProvider();
    return new ethers.Contract(contractAddress, abi, provider);
  }

  /**
   * Get contract instance with signer for write operations
   */
  async getContractWithSigner(contractAddress, abi) {
    if (!contractAddress || !abi) {
      throw new Error('Contract address and ABI are required');
    }

    const signer = await rpcClient.getSigner();
    return new ethers.Contract(contractAddress, abi, signer);
  }

  /**
   * Call a read-only contract method
   */
  async callContractMethod(contractAddress, abi, methodName, params = []) {
    try {
      const contract = this.getContract(contractAddress, abi);
      const result = await contract[methodName](...params);
      return result;
    } catch (error) {
      console.error(`Failed to call contract method ${methodName}:`, error);
      throw error;
    }
  }

  /**
   * Execute a contract transaction
   */
  async executeContractTransaction(contractAddress, abi, methodName, params = [], options = {}) {
    try {
      const contract = await this.getContractWithSigner(contractAddress, abi);
      
      // Estimate gas if not provided
      if (!options.gasLimit) {
        try {
          const estimatedGas = await contract[methodName].estimateGas(...params);
          options.gasLimit = estimatedGas;
        } catch (gasError) {
          console.warn('Failed to estimate gas, using default:', gasError.message);
        }
      }

      // Execute transaction
      const tx = await contract[methodName](...params, options);
      console.log(`Transaction sent: ${tx.hash}`);
      
      return tx;
    } catch (error) {
      console.error(`Failed to execute contract transaction ${methodName}:`, error);
      throw error;
    }
  }

  /**
   * Wait for transaction confirmation and return receipt
   */
  async waitForTransactionConfirmation(txHash, confirmations = 1) {
    try {
      console.log(`Waiting for transaction confirmation: ${txHash}`);
      const receipt = await rpcClient.waitForTransaction(txHash, confirmations);
      
      if (receipt.status === 1) {
        console.log(`Transaction confirmed: ${txHash}`);
        return receipt;
      } else {
        throw new Error(`Transaction failed: ${txHash}`);
      }
    } catch (error) {
      console.error('Failed to confirm transaction:', error);
      throw error;
    }
  }

  /**
   * Get transaction details
   */
  async getTransaction(txHash) {
    try {
      const provider = rpcClient.getProvider();
      return await provider.getTransaction(txHash);
    } catch (error) {
      console.error('Failed to get transaction:', error);
      throw error;
    }
  }

  /**
   * Get contract events/logs
   */
  async getContractEvents(contractAddress, abi, eventName, filter = {}) {
    try {
      const contract = this.getContract(contractAddress, abi);
      const eventFilter = contract.filters[eventName](...(filter.args || []));
      
      const events = await contract.queryFilter(
        eventFilter,
        filter.fromBlock || 0,
        filter.toBlock || 'latest'
      );
      
      return events;
    } catch (error) {
      console.error(`Failed to get contract events for ${eventName}:`, error);
      throw error;
    }
  }

  /**
   * Listen to contract events
   */
  listenToContractEvents(contractAddress, abi, eventName, callback, filter = {}) {
    try {
      const contract = this.getContract(contractAddress, abi);
      const eventFilter = contract.filters[eventName](...(filter.args || []));
      
      contract.on(eventFilter, callback);
      
      // Return cleanup function
      return () => {
        contract.off(eventFilter, callback);
      };
    } catch (error) {
      console.error(`Failed to listen to contract events for ${eventName}:`, error);
      throw error;
    }
  }

  /**
   * Get ERC20 token balance
   */
  async getTokenBalance(tokenAddress, userAddress) {
    try {
      // Standard ERC20 balanceOf method
      const erc20Abi = [
        'function balanceOf(address owner) view returns (uint256)',
        'function decimals() view returns (uint8)',
        'function symbol() view returns (string)',
        'function name() view returns (string)'
      ];
      
      const contract = this.getContract(tokenAddress, erc20Abi);
      const [balance, decimals] = await Promise.all([
        contract.balanceOf(userAddress),
        contract.decimals()
      ]);
      
      return {
        raw: balance,
        formatted: ethers.formatUnits(balance, decimals),
        decimals: decimals
      };
    } catch (error) {
      console.error('Failed to get token balance:', error);
      throw error;
    }
  }

  /**
   * Get ERC20 token info
   */
  async getTokenInfo(tokenAddress) {
    try {
      const erc20Abi = [
        'function decimals() view returns (uint8)',
        'function symbol() view returns (string)',
        'function name() view returns (string)',
        'function totalSupply() view returns (uint256)'
      ];
      
      const contract = this.getContract(tokenAddress, erc20Abi);
      const [name, symbol, decimals, totalSupply] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.decimals(),
        contract.totalSupply()
      ]);
      
      return {
        name,
        symbol,
        decimals,
        totalSupply: {
          raw: totalSupply,
          formatted: ethers.formatUnits(totalSupply, decimals)
        }
      };
    } catch (error) {
      console.error('Failed to get token info:', error);
      throw error;
    }
  }

  /**
   * Format token amount
   */
  formatTokenAmount(amount, decimals = 18) {
    try {
      return ethers.formatUnits(amount, decimals);
    } catch (error) {
      console.error('Failed to format token amount:', error);
      return '0';
    }
  }

  /**
   * Parse token amount
   */
  parseTokenAmount(amount, decimals = 18) {
    try {
      return ethers.parseUnits(amount.toString(), decimals);
    } catch (error) {
      console.error('Failed to parse token amount:', error);
      return ethers.parseUnits('0', decimals);
    }
  }

  /**
   * Check if service is initialized
   */
  isServiceInitialized() {
    return this.isInitialized && rpcClient.isClientConnected();
  }

  /**
   * Get current network info
   */
  async getNetworkInfo() {
    try {
      const provider = rpcClient.getProvider();
      const network = await provider.getNetwork();
      const blockNumber = await provider.getBlockNumber();
      
      return {
        chainId: network.chainId.toString(),
        name: network.name,
        blockNumber,
        ensAddress: network.ensAddress
      };
    } catch (error) {
      console.error('Failed to get network info:', error);
      throw error;
    }
  }

  /**
   * Disconnect and cleanup
   */
  disconnect() {
    this.contracts = {};
    this.isInitialized = false;
    rpcClient.disconnect();
    console.log('Blockchain service disconnected');
  }
}

// Export singleton instance
export const blockchainService = new BlockchainService();
export default blockchainService;
