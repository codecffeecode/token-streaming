import { useWallet } from './hooks/useWallet'
import { Header, HomePage, Dashboard, ManageUsers } from './components'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import { NavigationProvider, useNavigation } from './contexts/NavigationContext'
import './index.css'

const AppContent = () => {
  const { isConnected } = useWallet()
  const { isDark } = useTheme()
  const { currentPage } = useNavigation()

  const renderPage = () => {
    if (!isConnected) return <HomePage />
    
    switch (currentPage) {
      case 'manage-users':
        return <ManageUsers />
      case 'dashboard':
      default:
        return <Dashboard />
    }
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDark ? 'bg-background-dark' : 'bg-gray-50'
    }`}>
      <Header />
      {renderPage()}
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <NavigationProvider>
        <AppContent />
      </NavigationProvider>
    </ThemeProvider>
  )
}

export default App
