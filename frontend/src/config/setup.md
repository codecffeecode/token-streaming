# RPC Integration with MetaMask Setup Guide

## Overview

This integration provides seamless connection between your dApp and blockchain networks through:
- **Primary**: MetaMask provider (preferred for better UX)
- **Fallback**: Custom RPC endpoints with retry logic
- **Auto-switching**: Automatic network detection and switching
- **Event handling**: Real-time network and account change detection

## Environment Variables

Create a `.env` file in the frontend directory with the following variables:

```env
# RPC Configuration
VITE_RPC_URL=http://localhost:8545
VITE_FALLBACK_RPC_URL_1=https://your-fallback-rpc-1.com
VITE_FALLBACK_RPC_URL_2=https://your-fallback-rpc-2.com

# Network Configuration
VITE_CHAIN_ID=1337
VITE_NETWORK_NAME=Local Network
VITE_CURRENCY_NAME=Ether
VITE_CURRENCY_SYMBOL=ETH
VITE_BLOCK_EXPLORER_URL=https://etherscan.io

# Smart Contract Addresses
VITE_TOKEN_STREAMING_CONTRACT=0x1234567890123456789012345678901234567890
VITE_TOKEN_CONTRACT=0x0987654321098765432109876543210987654321

# API Configuration (if you have a backend)
VITE_API_BASE_URL=http://localhost:3001

# Development Settings
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug
```

## Smart Contract ABI

You'll need to provide your smart contract ABI. Add it to your component initialization:

```javascript
import { userService } from '../services/userService';

// Your contract ABI
const CONTRACT_ABI = [
  // Add your contract ABI here
  "function addUser(address user, uint256 tokens) external",
  "function removeUser(address user) external",
  "function getAllUsers() external view returns (tuple(address,uint256)[])",
  "function getBalance(address user) external view returns (uint256)",
  "function withdrawTokens(address user, uint256 amount) external",
  // ... more methods
];

// Set the ABI
userService.setContractABI(CONTRACT_ABI);
```

## MetaMask Integration Features

### Automatic Provider Detection
The system automatically detects and prefers MetaMask when available:
```javascript
// RPC client initializes with MetaMask by default
await rpcClient.initialize(true); // true = prefer MetaMask
```

### Network Management
```javascript
import { useWallet } from '../hooks/useWallet';

const { networkInfo, switchNetwork, isRpcConnected } = useWallet();

// Check current network
console.log('Current network:', networkInfo.name);
console.log('Chain ID:', networkInfo.chainId);

// Switch to configured network
await switchNetwork();
```

### Real-time Event Handling
The integration automatically handles:
- Account changes in MetaMask
- Network switches
- Connection/disconnection events
- RPC provider failures with fallback

### Network Status Component
```javascript
import NetworkStatus from '../components/NetworkStatus';

// Display current network status
<NetworkStatus className="mb-4" />
```

## Usage Examples

### Initialize the service with MetaMask
```javascript
import { useWallet } from '../hooks/useWallet';
import { useUserService } from '../hooks/useUserService';

const { isRpcConnected, networkInfo } = useWallet();
const { initialize, isServiceReady } = useUserService();

// Service automatically initializes with MetaMask
useEffect(() => {
  if (isRpcConnected) {
    initialize();
  }
}, [isRpcConnected]);
```

### Add a user with transaction tracking
```javascript
const { addUser, loading } = useUserService();

const result = await addUser('0x1234...', '100');
if (result.success) {
  console.log('User added:', result.data);
  console.log('Transaction hash:', result.txHash);
}
```

### Get all users from blockchain
```javascript
const { fetchUsers, users, loading } = useUserService();

await fetchUsers();
console.log('Users from blockchain:', users);
```

### Withdraw tokens with MetaMask signing
```javascript
const { withdrawTokens } = useUserService();

const result = await withdrawTokens('0x1234...', '50');
if (result.success) {
  console.log('Withdrawal successful:', result.data);
  console.log('Transaction hash:', result.txHash);
}
```

## Provider Modes

### MetaMask Mode (Default)
- Uses MetaMask's injected provider
- Automatic network switching
- User-friendly transaction signing
- Real-time event handling

### RPC Mode (Fallback)
- Direct RPC endpoint connection
- Multiple fallback URLs
- Retry logic with exponential backoff
- Read-only operations (no signing)

## Error Handling

The integration includes comprehensive error handling:
```javascript
const { error, clearError } = useUserService();

if (error) {
  console.error('Service error:', error);
  // Clear error after handling
  clearError();
}
```
