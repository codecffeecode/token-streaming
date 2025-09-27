import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { HiPlus, HiTrash, HiUpload, HiUser } from 'react-icons/hi';

const ManageUsers = () => {
  const { isDark } = useTheme();
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', address: '0x1234567890123456789012345678901234567890' },
    { id: 2, name: 'Jane Smith', address: '0x0987654321098765432109876543210987654321' },
    { id: 3, name: 'Alice Johnson', address: '0x1111222233334444555566667777888899990000' },
    { id: 4, name: 'Bob Wilson', address: '0xaaabbbcccdddeeefff000111222333444555666' },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', address: '' });
  const [importMode, setImportMode] = useState('individual'); // 'individual' or 'json'
  const [jsonInput, setJsonInput] = useState('');

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleAddUser = () => {
    if (newUser.name && newUser.address) {
      const newId = Math.max(...users.map(u => u.id), 0) + 1;
      setUsers([...users, { id: newId, ...newUser }]);
      setNewUser({ name: '', address: '' });
      setShowAddModal(false);
    }
  };

  const handleImportJson = () => {
    try {
      const importedUsers = JSON.parse(jsonInput);
      if (Array.isArray(importedUsers)) {
        const newUsers = importedUsers.map((user, index) => ({
          id: Math.max(...users.map(u => u.id), 0) + index + 1,
          name: user.name || `User ${index + 1}`,
          address: user.address || ''
        }));
        setUsers([...users, ...newUsers]);
        setJsonInput('');
        setShowAddModal(false);
      }
    } catch (error) {
      alert('Invalid JSON format');
    }
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const closeModal = () => {
    setShowAddModal(false);
    setNewUser({ name: '', address: '' });
    setJsonInput('');
    setImportMode('individual');
  };

  return (
    <div className={`min-h-screen py-8 ${
      isDark ? 'bg-background-dark' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`rounded-2xl shadow-sm p-8 mb-8 ${
          isDark ? 'bg-surface-dark' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${
                isDark ? 'text-gray-100' : 'text-gray-900'
              }`}>
                Manage Users
              </h1>
              <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                Add and manage users for salary streaming
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer ${
                isDark 
                  ? 'bg-primary-dark-500 hover:bg-primary-dark-600 text-white focus:ring-primary-dark-500' 
                  : 'bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500'
              }`}
            >
              <HiPlus className="w-5 h-5 mr-2" />
              Add User
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className={`rounded-2xl shadow-sm overflow-hidden ${
          isDark ? 'bg-surface-dark' : 'bg-white'
        }`}>
          <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className={`text-xl font-semibold ${
              isDark ? 'text-gray-100' : 'text-gray-900'
            }`}>
              Users ({users.length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={isDark ? 'bg-gray-800' : 'bg-gray-50'}>
                <tr>
                  <th className={`px-8 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                    isDark ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Name
                  </th>
                  <th className={`px-8 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                    isDark ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Wallet Address
                  </th>
                  <th className={`px-8 py-4 text-right text-xs font-medium uppercase tracking-wider ${
                    isDark ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${
                isDark ? 'divide-gray-700' : 'divide-gray-200'
              }`}>
                {users.map((user) => (
                  <tr key={user.id} className={`transition-colors duration-200 ${
                    isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                  }`}>
                    <td className="px-8 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                          isDark ? 'bg-primary-dark-900' : 'bg-primary-100'
                        }`}>
                          <HiUser className={`w-5 h-5 ${
                            isDark ? 'text-primary-dark-500' : 'text-primary-500'
                          }`} />
                        </div>
                        <div>
                          <div className={`text-sm font-medium ${
                            isDark ? 'text-gray-100' : 'text-gray-900'
                          }`}>
                            {user.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap">
                      <div className={`text-sm font-mono ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {formatAddress(user.address)}
                      </div>
                      <div className={`text-xs ${
                        isDark ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        {user.address}
                      </div>
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className={`inline-flex items-center p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer ${
                          isDark 
                            ? 'text-red-400 hover:bg-red-900/20 focus:ring-red-500' 
                            : 'text-red-600 hover:bg-red-50 focus:ring-red-500'
                        }`}
                        title="Delete user"
                      >
                        <HiTrash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="text-center py-12">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                isDark ? 'bg-gray-800' : 'bg-gray-50'
              }`}>
                <HiUser className={`w-10 h-10 ${
                  isDark ? 'text-gray-500' : 'text-gray-400'
                }`} />
              </div>
              <h3 className={`text-lg font-medium mb-2 ${
                isDark ? 'text-gray-100' : 'text-gray-900'
              }`}>No Users Added</h3>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                Start by adding users to manage salary streaming
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto ${
            isDark ? 'bg-surface-dark' : 'bg-white'
          }`}>
            <div className="p-8">
              <h2 className={`text-2xl font-bold mb-6 ${
                isDark ? 'text-gray-100' : 'text-gray-900'
              }`}>
                Add New User
              </h2>

              {/* Import Mode Toggle */}
              <div className="flex mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <button
                  onClick={() => setImportMode('individual')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer ${
                    importMode === 'individual'
                      ? isDark 
                        ? 'bg-primary-dark-500 text-white' 
                        : 'bg-primary-500 text-white'
                      : isDark 
                        ? 'text-gray-300 hover:text-gray-100' 
                        : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Individual
                </button>
                <button
                  onClick={() => setImportMode('json')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer ${
                    importMode === 'json'
                      ? isDark 
                        ? 'bg-primary-dark-500 text-white' 
                        : 'bg-primary-500 text-white'
                      : isDark 
                        ? 'text-gray-300 hover:text-gray-100' 
                        : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <HiUpload className="w-4 h-4 inline mr-1" />
                  JSON Import
                </button>
              </div>

              {importMode === 'individual' ? (
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Name
                    </label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        isDark 
                          ? 'bg-gray-800 border-gray-700 text-gray-100 focus:ring-primary-dark-500' 
                          : 'bg-white border-gray-300 text-gray-900 focus:ring-primary-500'
                      }`}
                      placeholder="Enter user name"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Wallet Address
                    </label>
                    <input
                      type="text"
                      value={newUser.address}
                      onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border font-mono text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        isDark 
                          ? 'bg-gray-800 border-gray-700 text-gray-100 focus:ring-primary-dark-500' 
                          : 'bg-white border-gray-300 text-gray-900 focus:ring-primary-500'
                      }`}
                      placeholder="0x..."
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    JSON Data
                  </label>
                  <textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    rows={8}
                    className={`w-full px-4 py-3 rounded-lg border font-mono text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      isDark 
                        ? 'bg-gray-800 border-gray-700 text-gray-100 focus:ring-primary-dark-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:ring-primary-500'
                    }`}
                    placeholder={`[
  {
    "name": "John Doe",
    "address": "0x1234..."
  },
  {
    "name": "Jane Smith", 
    "address": "0x5678..."
  }
]`}
                  />
                </div>
              )}

              <div className="flex space-x-4 mt-8">
                <button
                  onClick={closeModal}
                  className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer ${
                    isDark 
                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 focus:ring-gray-500' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-500'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={importMode === 'individual' ? handleAddUser : handleImportJson}
                  disabled={importMode === 'individual' ? !newUser.name || !newUser.address : !jsonInput}
                  className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer disabled:cursor-not-allowed ${
                    isDark 
                      ? 'bg-primary-dark-500 hover:bg-primary-dark-600 disabled:bg-primary-dark-300 text-white focus:ring-primary-dark-500' 
                      : 'bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white focus:ring-primary-500'
                  }`}
                >
                  {importMode === 'individual' ? 'Add User' : 'Import Users'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
