import { useWallet } from './hooks/useWallet'
import { Header, HomePage, Dashboard } from './components'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import './index.css'

const AppContent = () => {
  const { isConnected } = useWallet()
  const { isDark } = useTheme()

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDark ? 'bg-background-dark' : 'bg-gray-50'
    }`}>
      <Header />
      {isConnected ? <Dashboard /> : <HomePage />}
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
