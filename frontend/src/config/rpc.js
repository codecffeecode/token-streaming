// RPC Configuration
export const RPC_CONFIG = {
  // Default RPC endpoint - replace with your actual RPC URL
  DEFAULT_RPC_URL: import.meta.env.VITE_RPC_URL || 'http://localhost:8545',
  
  // Fallback RPC URLs for redundancy (popular public RPCs as examples)
  FALLBACK_RPC_URLS: [
    import.meta.env.VITE_FALLBACK_RPC_URL_1,
    import.meta.env.VITE_FALLBACK_RPC_URL_2,
    // Add popular public RPCs as fallbacks
    'https://rpc.ankr.com/eth',
    'https://eth-mainnet.public.blastapi.io',
  ].filter(Boolean),
  
  // Request timeout in milliseconds
  REQUEST_TIMEOUT: 30000,
  
  // Retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  
  // Batch request configuration
  MAX_BATCH_SIZE: 10,
  BATCH_TIMEOUT: 5000,
  
  // MetaMask specific settings
  PREFER_METAMASK: true,
  AUTO_SWITCH_NETWORK: true,
};

// Network configuration
export const NETWORK_CONFIG = {
  // Chain ID for your network
  CHAIN_ID: import.meta.env.VITE_CHAIN_ID || '1337',
  
  // Network name
  NETWORK_NAME: import.meta.env.VITE_NETWORK_NAME || 'Local Network',
  
  // Native currency
  NATIVE_CURRENCY: {
    name: import.meta.env.VITE_CURRENCY_NAME || 'Ether',
    symbol: import.meta.env.VITE_CURRENCY_SYMBOL || 'ETH',
    decimals: 18,
  },
  
  // Block explorer URL (optional)
  BLOCK_EXPLORER_URL: import.meta.env.VITE_BLOCK_EXPLORER_URL,
};

// Smart contract addresses
export const CONTRACT_ADDRESSES = {
  // Token streaming contract
  TOKEN_STREAMING: import.meta.env.VITE_TOKEN_STREAMING_CONTRACT,
  
  // Token contract (if using ERC20)
  TOKEN_CONTRACT: import.meta.env.VITE_TOKEN_CONTRACT,
  
  // Add other contract addresses as needed
};

// API endpoints for your backend (if you have one)
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  
  ENDPOINTS: {
    USERS: '/api/users',
    STREAMS: '/api/streams',
    TRANSACTIONS: '/api/transactions',
  },
};
