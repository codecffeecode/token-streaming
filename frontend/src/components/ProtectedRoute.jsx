import { Navigate } from 'react-router-dom';
import { useWallet, WALLET_ADDRESS_KEY } from '../hooks/useWallet';

const ProtectedRoute = ({ children }) => {
  // const { isConnected } = useWallet();
  
  if (!localStorage.getItem(WALLET_ADDRESS_KEY)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
