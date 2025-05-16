import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

// Icon declarations
const ClipboardCheckIcon = getIcon('ClipboardCheck');
const UsersIcon = getIcon('Users');
const CalendarIcon = getIcon('Calendar');
const TrendingUpIcon = getIcon('TrendingUp');

const Home = () => {
  const [user, setUser] = useState({
    name: "Alex Chen",
    role: "Senior Developer",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    taskCount: 7
  });

  const [stats, setStats] = useState([
    { id: 1, title: "Active Tasks", value: 12, icon: ClipboardCheckIcon, color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" },
    { id: 2, title: "Team Members", value: 8, icon: UsersIcon, color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" },
    { id: 3, title: "Due This Week", value: 4, icon: CalendarIcon, color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" },
    { id: 4, title: "Completed", value: 23, icon: TrendingUpIcon, color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" }
  ]);

  // Track component mount for animation
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Show welcome toast on first load
  useEffect(() => {
    toast.success(`Welcome back, ${user.name}!`, {
      icon: "👋",
    });
  }, []);

  return (
    <div className="space-y-8 pb-12">
      {/* User welcome section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-8"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-primary shadow-md">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Hello, {user.name}</h1>
              <p className="text-surface-600 dark:text-surface-400">{user.role} • {user.taskCount} tasks assigned</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-outline">View Profile</button>
            <button className="btn btn-primary">New Task</button>
          </div>
        </div>
      </motion.section>

      {/* Stats Overview */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
              className="card hover:shadow-soft transition-shadow duration-300 flex items-center justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold">{stat.title}</h3>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Main feature component */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full"
      >
        <MainFeature />
      </motion.section>
    </div>
  );
};

export default Home;