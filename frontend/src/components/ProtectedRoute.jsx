import { Navigate } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';

const ProtectedRoute = ({ children }) => {
  const { isConnected } = useWallet();
  
  if (!isConnected) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
