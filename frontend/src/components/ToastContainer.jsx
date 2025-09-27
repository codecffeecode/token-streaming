import { useToast } from '../contexts/ToastContext';
import { useTheme } from '../contexts/ThemeContext';
import { HiX, HiCheckCircle, HiExclamationCircle, HiInformationCircle, HiExclamation } from 'react-icons/hi';

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();
  const { isDark } = useTheme();

  const getToastIcon = (type) => {
    switch (type) {
      case 'success':
        return <HiCheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <HiExclamationCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <HiExclamation className="w-5 h-5 text-yellow-400" />;
      case 'info':
      default:
        return <HiInformationCircle className="w-5 h-5 text-blue-400" />;
    }
  };

  const getToastStyles = (type) => {
    const baseStyles = `border-l-4 ${isDark ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`;
    
    switch (type) {
      case 'success':
        return `${baseStyles} border-green-400`;
      case 'error':
        return `${baseStyles} border-red-400`;
      case 'warning':
        return `${baseStyles} border-yellow-400`;
      case 'info':
      default:
        return `${baseStyles} border-blue-400`;
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            max-w-md w-full shadow-lg rounded-lg pointer-events-auto
            transform transition-all duration-300 ease-in-out
            animate-in slide-in-from-right-full
            ${getToastStyles(toast.type)}
          `}
        >
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {getToastIcon(toast.type)}
              </div>
              <div className="ml-3 w-0 flex-1">
                <p className={`text-sm font-medium ${
                  isDark ? 'text-gray-100' : 'text-gray-900'
                }`}>
                  {toast.message}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  onClick={() => removeToast(toast.id)}
                  className={`rounded-md inline-flex focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
                    isDark 
                      ? 'text-gray-400 hover:text-gray-200 focus:ring-gray-500' 
                      : 'text-gray-400 hover:text-gray-500 focus:ring-gray-500'
                  }`}
                >
                  <span className="sr-only">Close</span>
                  <HiX className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
