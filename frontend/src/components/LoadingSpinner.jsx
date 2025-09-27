import { useTheme } from '../contexts/ThemeContext';

const LoadingSpinner = ({ size = 'md', text = 'Loading...', className = '' }) => {
  const { isDark } = useTheme();

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-solid ${
          isDark 
            ? 'border-primary-dark-200 border-t-primary-dark-500' 
            : 'border-primary-200 border-t-primary-500'
        }`}
      />
      {text && (
        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
