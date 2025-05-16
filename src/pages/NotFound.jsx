import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

// Icon declarations
const HomeIcon = getIcon('Home');
const FrownIcon = getIcon('Frown');

const NotFound = () => {
  useEffect(() => {
    document.title = "Page Not Found | DevTrack";
    return () => {
      document.title = "DevTrack - Task Management for Software Teams";
    };
  }, []);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-8 max-w-lg"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 15,
            delay: 0.2
          }}
        >
          <FrownIcon className="mx-auto h-20 w-20 text-accent" />
        </motion.div>
        
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-surface-800 dark:text-surface-100">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-surface-700 dark:text-surface-200">
            Page Not Found
          </h2>
          <p className="text-lg text-surface-600 dark:text-surface-400 max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </p>
        </div>
        
        <div className="pt-4">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 btn btn-primary px-6 py-3 text-lg"
          >
            <HomeIcon className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;