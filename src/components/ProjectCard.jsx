import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import getIcon from '../utils/iconUtils';
import { useProjectContext } from '../context/ProjectContext';

const EditIcon = getIcon('Edit');
const TrashIcon = getIcon('Trash');
const UsersIcon = getIcon('Users');
const ClipboardCheckIcon = getIcon('ClipboardCheck');
const CalendarIcon = getIcon('Calendar');

const statusStyles = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  'on-hold': 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
};

const ProjectCard = ({ project, onEdit }) => {
  const navigate = useNavigate();
  const { deleteProject } = useProjectContext();
  
  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete the project "${project.name}"?`)) {
      deleteProject(project.id);
      toast.success('Project deleted successfully');
    }
  };
  
  const handleViewTasks = () => {
    navigate(`/?projectId=${project.id}`);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="card hover:shadow-md transition-all"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className={`text-xs px-2 py-1 rounded-full ${statusStyles[project.status]}`}>
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </span>
        </div>
        <div className="flex space-x-1">
          <button 
            onClick={onEdit}
            className="p-1.5 text-surface-500 hover:text-primary rounded-md hover:bg-surface-100 dark:hover:bg-surface-700"
          >
            <EditIcon className="h-4 w-4" />
          </button>
          <button 
            onClick={handleDelete}
            className="p-1.5 text-surface-500 hover:text-red-500 rounded-md hover:bg-surface-100 dark:hover:bg-surface-700"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
      <p className="text-surface-600 dark:text-surface-400 text-sm mb-4 line-clamp-2">{project.description}</p>
      
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center gap-1.5 text-sm text-surface-600 dark:text-surface-400">
          <UsersIcon className="h-4 w-4" />
          <span>{project.teamSize} Members</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-surface-600 dark:text-surface-400">
          <ClipboardCheckIcon className="h-4 w-4" />
          <span>{project.taskCount} Tasks</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-2 pt-4 border-t border-surface-200 dark:border-surface-700">
        <div className="flex items-center gap-1.5 text-sm text-surface-600 dark:text-surface-400">
          <CalendarIcon className="h-4 w-4" />
          <span>Due {new Date(project.deadline).toLocaleDateString()}</span>
        </div>
        <button onClick={handleViewTasks} className="btn btn-outline py-1 px-3 text-sm">
          View Tasks
        </button>
      </div>
    </motion.div>
  );
};

export default ProjectCard;