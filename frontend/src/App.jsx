import { useWallet } from './hooks/useWallet'
import { Header, HomePage, Dashboard } from './components'
import './index.css'

function App() {
  const { isConnected } = useWallet()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {isConnected ? <Dashboard /> : <HomePage />}
    </div>
  )
}

export default App
