import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const LoadingSpinner = ({ fullScreen = false, size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const orbitSizes = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28'
  };

  const spinner = (
    <div className="flex flex-col items-center gap-4">
      <div className="relative flex items-center justify-center">
        {/* Orbiting particles */}
        <motion.div
          className={`absolute ${orbitSizes[size]}`}
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-pink-400"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-400"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
          />
        </motion.div>

        {/* Main spinner */}
        <motion.div
          className={`${sizes[size]} rounded-2xl bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 shadow-lg shadow-purple-200`}
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
            scale: { duration: 1, repeat: Infinity, ease: 'easeInOut' }
          }}
        />
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Sparkles className="w-1/2 h-1/2 text-white drop-shadow-lg" />
        </motion.div>
      </div>
      {fullScreen && (
        <motion.p 
          className="text-gray-500 text-sm font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading magic...
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="pastel-blob blob-pink" />
        <div className="pastel-blob blob-purple" />
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
