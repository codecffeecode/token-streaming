import { useWallet } from '../hooks/useWallet';
import { useTheme } from '../contexts/ThemeContext';

const Dashboard = () => {
  const { address, formatAddress } = useWallet();
  const { isDark } = useTheme();


  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="rounded-2xl shadow-sm p-8 mb-8 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                Welcome back!
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Connected wallet: <span className="font-mono text-blue-600 dark:text-blue-400">{formatAddress(address)}</span>
              </p>
            </div>
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="rounded-xl shadow-sm p-6 bg-white dark:bg-gray-800">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Streamed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">$0.00</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl shadow-sm p-6 bg-white dark:bg-gray-800">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900">
                <svg className="w-6 h-6 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Streams</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">0</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl shadow-sm p-6 bg-white dark:bg-gray-800">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
                <svg className="w-6 h-6 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Receipts Generated</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Streaming Section */}
          <div className="rounded-xl shadow-sm p-8 bg-white dark:bg-gray-800">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Salary Streaming</h2>
            
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-gray-50 dark:bg-gray-700">
                <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">No Active Streams</h3>
              <p className="mb-6 text-gray-600 dark:text-gray-400">Start streaming your salary payments on the blockchain</p>
              <button className="px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-400">
                <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Stream
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;