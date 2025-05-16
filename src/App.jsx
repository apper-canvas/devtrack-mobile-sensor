import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';
import getIcon from './utils/iconUtils';
import { ProjectProvider } from './context/ProjectContext';

// Pages
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Projects from './pages/Projects';

// Components
const HomeIcon = getIcon('Home');
const FolderIcon = getIcon('Folder');
const MoonIcon = getIcon('Moon');
const SunIcon = getIcon('Sun');

function App() {
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <div className="min-h-screen transition-colors duration-300">
      <header className="fixed top-0 w-full bg-white dark:bg-surface-800 shadow-sm z-10 transition-colors">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-primary dark:text-primary-light">
            <span className="text-accent">Developers</span> TaskFlow
          </h1>
          
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink to="/" icon={HomeIcon} label="Dashboard" />
            <NavLink to="/projects" icon={FolderIcon} label="Projects" />
          </nav>
          
          <div className="flex items-center space-x-4">
            <div className="md:hidden">
              <select 
                className="bg-transparent text-surface-700 dark:text-surface-300 border-none focus:ring-0"
                onChange={(e) => { window.location.href = e.target.value; }}
                value={window.location.pathname}
              >
                <option value="/">Dashboard</option>
                <option value="/projects">Projects</option>
              </select>
            </div>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isDarkMode ? "dark" : "light"}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="block"
              >
                {isDarkMode ? 
                  <SunIcon className="h-5 w-5 text-yellow-300" /> : 
                  <MoonIcon className="h-5 w-5 text-surface-600" />
                }
              </motion.span>
            </AnimatePresence>
          </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto pt-16 px-4 pb-20">
        <ProjectProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ProjectProvider>
      </main>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDarkMode ? "dark" : "light"}
        toastClassName="shadow-card dark:bg-surface-800 dark:text-white"
      />
    </div>
  );
}

// Navigation link component
const NavLink = ({ to, icon: Icon, label }) => {
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    setIsActive(window.location.pathname === to);
  }, [to]);
  
  return (
    <a href={to} className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${isActive ? 'bg-primary-light/10 text-primary' : 'text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'}`}>
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </a>
  );
};

export default App;