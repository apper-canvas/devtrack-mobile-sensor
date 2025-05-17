import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import { useProjectContext } from '../context/ProjectContext';
import MainFeature from '../components/MainFeature';

// Icon declarations
const ClipboardCheckIcon = getIcon('ClipboardCheck');
const UsersIcon = getIcon('Users');
const CalendarIcon = getIcon('Calendar');
const TrendingUpIcon = getIcon('TrendingUp');
const FolderIcon = getIcon('Folder');
const PlusIcon = getIcon('Plus');

const Home = () => {
  const { projects } = useProjectContext();
  const [user, setUser] = useState({
    name: "Luke Chen",
    role: "Senior Developer",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    taskCount: 7
  });

  const [currentTime, setCurrentTime] = useState(dayjs().format('HH:mm'));
  const [currentDate, setCurrentDate] = useState(dayjs().format('dddd, MMMM D, YYYY'));
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(dayjs().format('HH:mm'));
      setCurrentDate(dayjs().format('dddd, MMMM D, YYYY'));
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);
  
  const [activeProjects, setActiveProjects] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  
  useEffect(() => {
    // Calculate active projects
    const active = projects.filter(project => project.status === 'active').length;
    setActiveProjects(active);
    
    // Calculate total tasks
    const tasks = projects.reduce((acc, project) => acc + project.taskCount, 0);
    setTotalTasks(tasks);
  }, [projects]);

  const [stats, setStats] = useState([
    { id: 1, title: "Total Projects", value: 0, icon: FolderIcon, color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" },
    { id: 2, title: "Active Projects", value: 0, icon: ClipboardCheckIcon, color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" },
    { id: 3, title: "Team Members", value: 8, icon: UsersIcon, color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" },
    { id: 4, title: "Total Tasks", value: 0, icon: CalendarIcon, color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" }
  ]);

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
  
  // Update stats based on projects data
  useEffect(() => {
    setStats(prevStats => prevStats.map(stat => {
      if (stat.title === "Total Projects") {
        return { ...stat, value: projects.length };
      } else if (stat.title === "Active Projects") {
        return { ...stat, value: activeProjects };
      } else if (stat.title === "Total Tasks") {
        return { ...stat, value: totalTasks };
      }
      return stat;
    }));
  }, [projects, activeProjects, totalTasks]);

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
              <p className="text-primary font-semibold mt-1">Today: {currentDate}</p>
              <p className="text-primary font-semibold">Current time: {currentTime}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-outline">View Profile</button>
            <a href="/projects" className="btn btn-primary flex items-center gap-2">
              <FolderIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Projects</span>
            </a>
          </div>
        </div>
      </motion.section>
      
      {/* Project Highlights */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
        transition={{ duration: 0.5, delay: 0.05 }}
      >
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">Recent Projects</h2>
          <a href="/projects" className="text-primary hover:text-primary-dark dark:hover:text-primary-light text-sm font-medium flex items-center gap-1">
            <span>View All</span>
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <AnimatePresence>
            {projects.slice(0, 3).map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="card hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${project.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'}`}>
                      {project.status === 'active' ? 'Active' : 'On Hold'}
                    </span>
                  </div>
                  <div className="text-sm text-surface-500">
                    {project.taskCount} tasks
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold mt-2">{project.name}</h3>
                <p className="text-surface-600 dark:text-surface-400 text-sm mt-1 mb-3 line-clamp-2">
                  {project.description}
                </p>
                
                <div className="flex justify-between items-center mt-2">
                  <div className="flex -space-x-2">
                    {project.teamMembers?.slice(0, 3).map((member, i) => (
                      <div key={i} className="h-8 w-8 rounded-full border-2 border-white dark:border-surface-800 overflow-hidden">
                        <img src={member.avatar} alt={member.name} className="h-full w-full object-cover" />
                      </div>
                    ))}
                    {(project.teamMembers?.length || 0) > 3 && (
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                        +{project.teamMembers.length - 3}
                      </div>
                    )}
                  </div>
                  
                  <a href={`/?projectId=${project.id}`} className="btn btn-outline text-sm py-1 px-3">
                    View Tasks
                  </a>
                </div>
              </motion.div>
            ))}
            
            {projects.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card col-span-3 flex flex-col items-center justify-center p-10"
              >
                <FolderIcon className="h-16 w-16 text-surface-300 dark:text-surface-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
                <p className="text-surface-600 dark:text-surface-400 text-center mb-4">
                  Create your first project to get started with task management
                </p>
                <a href="/projects" className="btn btn-primary flex items-center gap-2">
                  <PlusIcon className="h-5 w-5" />
                  <span>Create Project</span>
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Stats Overview */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="mb-3">
          <h2 className="text-xl font-semibold">Overview</h2>
        </div>
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

      {/* Call to action */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="mb-6"
      >
        <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold text-white">Ready to manage your tasks?</h2>
              <p className="text-white/80 mt-1">
                Create projects, assign tasks, and track progress all in one place.
              </p>
            </div>
            <div className="flex gap-3">
              <a href="/projects" className="btn bg-white text-primary hover:bg-gray-100">
                View Projects
              </a>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Stats Overview */}

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