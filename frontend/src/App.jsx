import { Routes, Route, Navigate } from 'react-router-dom'
import { HomePage, Dashboard, ManageUsers, PublicLayout, AuthenticatedLayout, ProtectedRoute, ToastContainer } from './components'
import { ThemeProvider } from './contexts/ThemeContext'
import { ToastProvider } from './contexts/ToastContext'
import { useWallet } from './hooks/useWallet'
import './index.css'


function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Routes>
          {/* Public routes with PublicLayout */}
          <Route path="home" element={<PublicLayout />}>
            <Route index element={<HomePage />} />
          </Route>
          
          {/* Protected routes with AuthenticatedLayout */}
          <Route element={<AuthenticatedLayout />}>
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
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
        
        {/* Toast Container */}
        <ToastContainer />
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
