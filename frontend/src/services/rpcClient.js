import { ethers } from 'ethers';
import { RPC_CONFIG, NETWORK_CONFIG } from '../config/rpc.js';

/**
 * RPC Client for handling blockchain interactions with MetaMask integration
 */
class RPCClient {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.metaMaskProvider = null;
    this.currentRpcIndex = 0;
    this.isConnected = false;
    this.useMetaMaskProvider = false;
    this.networkInfo = null;
  }

  /**
   * Initialize the RPC client with provider (prioritizes MetaMask)
   */
  async initialize(preferMetaMask = true) {
    try {
      if (preferMetaMask && this.isMetaMaskAvailable()) {
        await this.connectToMetaMask();
      } else {
        await this.connectToProvider();
      }
      this.isConnected = true;
      console.log('RPC Client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize RPC client:', error);
      // Fallback to regular RPC if MetaMask fails
      if (preferMetaMask && this.isMetaMaskAvailable()) {
        console.log('Falling back to regular RPC provider...');
        try {
          await this.connectToProvider();
          this.isConnected = true;
          console.log('RPC Client initialized with fallback provider');
        } catch (fallbackError) {
          console.error('Fallback provider also failed:', fallbackError);
          throw fallbackError;
        }
      } else {
        throw error;
      }
    }
  }

  /**
   * Check if MetaMask is available
   */
  isMetaMaskAvailable() {
    return typeof window !== 'undefined' && 
           typeof window.ethereum !== 'undefined' && 
           window.ethereum.isMetaMask;
  }

  /**
   * Connect to MetaMask provider
   */
  async connectToMetaMask() {
    if (!this.isMetaMaskAvailable()) {
      throw new Error('MetaMask is not available');
    }

    try {
      console.log('Connecting to MetaMask provider...');
      
      // Create MetaMask provider
      this.metaMaskProvider = new ethers.BrowserProvider(window.ethereum);
      this.provider = this.metaMaskProvider;
      this.useMetaMaskProvider = true;

      // Get network info
      this.networkInfo = await this.provider.getNetwork();
      
      // Validate network if configured
      if (NETWORK_CONFIG.CHAIN_ID && 
          this.networkInfo.chainId.toString() !== NETWORK_CONFIG.CHAIN_ID) {
        console.warn(`Network mismatch. Expected: ${NETWORK_CONFIG.CHAIN_ID}, Got: ${this.networkInfo.chainId}`);
        
        // Attempt to switch network
        await this.switchToConfiguredNetwork();
      }

      console.log(`Connected to MetaMask on network: ${this.networkInfo.name} (${this.networkInfo.chainId})`);
      
      // Set up event listeners
      this.setupMetaMaskEventListeners();
      
    } catch (error) {
      console.error('Failed to connect to MetaMask:', error);
      throw error;
    }
  }

  /**
   * Connect to RPC provider with fallback support
   */
  async connectToProvider() {
    const rpcUrls = [RPC_CONFIG.DEFAULT_RPC_URL, ...RPC_CONFIG.FALLBACK_RPC_URLS];
    
    for (let i = 0; i < rpcUrls.length; i++) {
      try {
        const rpcUrl = rpcUrls[i];
        if (!rpcUrl) continue;

        console.log(`Attempting to connect to RPC: ${rpcUrl}`);
        
        // Create provider
        this.provider = new ethers.JsonRpcProvider(rpcUrl, {
          chainId: parseInt(NETWORK_CONFIG.CHAIN_ID),
          name: NETWORK_CONFIG.NETWORK_NAME,
        });

        // Test connection
        this.networkInfo = await this.provider.getNetwork();
        
        this.currentRpcIndex = i;
        this.useMetaMaskProvider = false;
        console.log(`Successfully connected to RPC: ${rpcUrl}`);
        return;
        
      } catch (error) {
        console.warn(`Failed to connect to RPC ${rpcUrls[i]}:`, error.message);
        continue;
      }
    }
    
    throw new Error('Failed to connect to any RPC endpoint');
  }

  /**
   * Switch to configured network in MetaMask
   */
  async switchToConfiguredNetwork() {
    if (!this.isMetaMaskAvailable()) {
      throw new Error('MetaMask is not available');
    }

    try {
      const chainIdHex = `0x${parseInt(NETWORK_CONFIG.CHAIN_ID).toString(16)}`;
      
      // Try to switch to the network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });
      
      console.log(`Switched to network: ${NETWORK_CONFIG.NETWORK_NAME}`);
      
    } catch (switchError) {
      // If network doesn't exist, try to add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${parseInt(NETWORK_CONFIG.CHAIN_ID).toString(16)}`,
              chainName: NETWORK_CONFIG.NETWORK_NAME,
              nativeCurrency: NETWORK_CONFIG.NATIVE_CURRENCY,
              rpcUrls: [RPC_CONFIG.DEFAULT_RPC_URL],
              blockExplorerUrls: NETWORK_CONFIG.BLOCK_EXPLORER_URL ? [NETWORK_CONFIG.BLOCK_EXPLORER_URL] : null,
            }],
          });
          
          console.log(`Added and switched to network: ${NETWORK_CONFIG.NETWORK_NAME}`);
          
        } catch (addError) {
          console.error('Failed to add network:', addError);
          throw addError;
        }
      } else {
        console.error('Failed to switch network:', switchError);
        throw switchError;
      }
    }
  }

  /**
   * Setup MetaMask event listeners
   */
  setupMetaMaskEventListeners() {
    if (!window.ethereum) return;

    // Listen for network changes
    window.ethereum.on('chainChanged', (chainId) => {
      console.log('Network changed to:', chainId);
      this.handleNetworkChange(chainId);
    });

    // Listen for account changes
    window.ethereum.on('accountsChanged', (accounts) => {
      console.log('Accounts changed:', accounts);
      this.handleAccountChange(accounts);
    });

    // Listen for connection changes
    window.ethereum.on('connect', (connectInfo) => {
      console.log('MetaMask connected:', connectInfo);
    });

    window.ethereum.on('disconnect', (error) => {
      console.log('MetaMask disconnected:', error);
      this.handleDisconnect();
    });
  }

  /**
   * Handle network change
   */
  async handleNetworkChange(chainId) {
    try {
      if (this.useMetaMaskProvider) {
        this.networkInfo = await this.provider.getNetwork();
        console.log(`Network changed to: ${this.networkInfo.name} (${this.networkInfo.chainId})`);
        
        // Emit custom event for components to listen to
        window.dispatchEvent(new CustomEvent('rpc-network-changed', {
          detail: { networkInfo: this.networkInfo, chainId }
        }));
      }
    } catch (error) {
      console.error('Error handling network change:', error);
    }
  }

  /**
   * Handle account change
   */
  handleAccountChange(accounts) {
    // Reset signer when accounts change
    this.signer = null;
    
    // Emit custom event for components to listen to
    window.dispatchEvent(new CustomEvent('rpc-account-changed', {
      detail: { accounts }
    }));
  }

  /**
   * Handle disconnect
   */
  handleDisconnect() {
    if (this.useMetaMaskProvider) {
      this.isConnected = false;
      this.signer = null;
      
      // Emit custom event for components to listen to
      window.dispatchEvent(new CustomEvent('rpc-disconnected'));
    }
  }

  /**
   * Get signer from MetaMask
   */
  async getSigner() {
    if (!window.ethereum) {
      throw new Error('MetaMask not found');
    }

    try {
      // Use existing MetaMask provider if available
      if (this.useMetaMaskProvider && this.metaMaskProvider) {
        this.signer = await this.metaMaskProvider.getSigner();
      } else {
        // Create new Web3Provider from MetaMask
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        this.signer = await web3Provider.getSigner();
      }
      
      return this.signer;
    } catch (error) {
      console.error('Failed to get signer:', error);
      throw error;
    }
  }

  /**
   * Execute RPC call with retry logic
   */
  async executeCall(method, params = [], options = {}) {
    const { retries = RPC_CONFIG.MAX_RETRIES, timeout = RPC_CONFIG.REQUEST_TIMEOUT } = options;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Add timeout to the call
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('RPC call timeout')), timeout);
        });

        const callPromise = this.provider.send(method, params);
        const result = await Promise.race([callPromise, timeoutPromise]);
        
        return result;
        
      } catch (error) {
        console.warn(`RPC call attempt ${attempt + 1} failed:`, error.message);
        
        if (attempt === retries) {
          throw error;
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, RPC_CONFIG.RETRY_DELAY * (attempt + 1)));
        
        // Try to reconnect if connection lost
        if (error.message.includes('connection') || error.message.includes('network')) {
          try {
            await this.connectToProvider();
          } catch (reconnectError) {
            console.warn('Failed to reconnect:', reconnectError.message);
          }
        }
      }
    }
  }

  /**
   * Get current block number
   */
  async getBlockNumber() {
    try {
      return await this.provider.getBlockNumber();
    } catch (error) {
      console.error('Failed to get block number:', error);
      throw error;
    }
  }

  /**
   * Get transaction receipt
   */
  async getTransactionReceipt(txHash) {
    try {
      return await this.provider.getTransactionReceipt(txHash);
    } catch (error) {
      console.error('Failed to get transaction receipt:', error);
      throw error;
    }
  }

  /**
   * Wait for transaction confirmation
   */
  async waitForTransaction(txHash, confirmations = 1) {
    try {
      return await this.provider.waitForTransaction(txHash, confirmations);
    } catch (error) {
      console.error('Failed to wait for transaction:', error);
      throw error;
    }
  }

  /**
   * Get account balance
   */
  async getBalance(address) {
    try {
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Failed to get balance:', error);
      throw error;
    }
  }

  /**
   * Estimate gas for transaction
   */
  async estimateGas(transaction) {
    try {
      return await this.provider.estimateGas(transaction);
    } catch (error) {
      console.error('Failed to estimate gas:', error);
      throw error;
    }
  }

  /**
   * Get current gas price
   */
  async getGasPrice() {
    try {
      const feeData = await this.provider.getFeeData();
      return feeData.gasPrice;
    } catch (error) {
      console.error('Failed to get gas price:', error);
      throw error;
    }
  }

  /**
   * Execute batch RPC calls
   */
  async executeBatch(calls) {
    if (calls.length > RPC_CONFIG.MAX_BATCH_SIZE) {
      throw new Error(`Batch size exceeds maximum of ${RPC_CONFIG.MAX_BATCH_SIZE}`);
    }

    try {
      const promises = calls.map(call => 
        this.executeCall(call.method, call.params, { timeout: RPC_CONFIG.BATCH_TIMEOUT })
      );
      
      return await Promise.all(promises);
    } catch (error) {
      console.error('Batch RPC call failed:', error);
      throw error;
    }
  }

  /**
   * Check if client is connected
   */
  isClientConnected() {
    return this.isConnected && this.provider !== null;
  }

  /**
   * Get provider instance
   */
  getProvider() {
    if (!this.provider) {
      throw new Error('RPC client not initialized');
    }
    return this.provider;
  }

  /**
   * Get current network information
   */
  getNetworkInfo() {
    return this.networkInfo;
  }

  /**
   * Check if using MetaMask provider
   */
  isUsingMetaMask() {
    return this.useMetaMaskProvider;
  }

  /**
   * Force reconnection to MetaMask
   */
  async reconnectToMetaMask() {
    if (!this.isMetaMaskAvailable()) {
      throw new Error('MetaMask is not available');
    }
    
    try {
      await this.connectToMetaMask();
      this.isConnected = true;
      console.log('Reconnected to MetaMask successfully');
    } catch (error) {
      console.error('Failed to reconnect to MetaMask:', error);
      throw error;
    }
  }

  /**
   * Switch provider mode
   */
  async switchProviderMode(useMetaMask = true) {
    try {
      this.disconnect();
      await this.initialize(useMetaMask);
    } catch (error) {
      console.error('Failed to switch provider mode:', error);
      throw error;
    }
  }

  /**
   * Get provider type
   */
  getProviderType() {
    return this.useMetaMaskProvider ? 'MetaMask' : 'RPC';
  }

  /**
   * Cleanup event listeners
   */
  cleanupEventListeners() {
    if (window.ethereum && this.useMetaMaskProvider) {
      window.ethereum.removeAllListeners('chainChanged');
      window.ethereum.removeAllListeners('accountsChanged');
      window.ethereum.removeAllListeners('connect');
      window.ethereum.removeAllListeners('disconnect');
    }
  }

  /**
   * Disconnect and cleanup
   */
  disconnect() {
    this.cleanupEventListeners();
    this.provider = null;
    this.signer = null;
    this.metaMaskProvider = null;
    this.isConnected = false;
    this.useMetaMaskProvider = false;
    this.networkInfo = null;
    console.log('RPC client disconnected');
  }
}

// Export singleton instance
export const rpcClient = new RPCClient();
export default rpcClient;
