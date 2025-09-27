import { Routes, Route, Navigate } from 'react-router-dom'
import { HomePage, Dashboard, ManageUsers, PublicLayout, AuthenticatedLayout, ProtectedRoute } from './components'
import { ThemeProvider } from './contexts/ThemeContext'
import { useWallet } from './hooks/useWallet'
import './index.css'

// Component to handle root redirect based on wallet connection
const RootRedirect = () => {
  const { isConnected } = useWallet()
  return isConnected ? <Navigate to="/dashboard" replace /> : <HomePage />
}

function App() {
  return (
    <ThemeProvider>
      <Routes>
        {/* Public routes with PublicLayout */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<RootRedirect />} />
        </Route>
        
        {/* Protected routes with AuthenticatedLayout */}
        <Route path="/" element={<AuthenticatedLayout />}>
          <Route 
            path="dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="manage-users" 
            element={
              <ProtectedRoute>
                <ManageUsers />
              </ProtectedRoute>
            } 
          />
        </Route>
        
        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
