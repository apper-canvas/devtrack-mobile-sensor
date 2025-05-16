import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import getIcon from '../utils/iconUtils';
import { useProjectContext } from '../context/ProjectContext';

// Icon declarations
const PlusIcon = getIcon('Plus');
const XIcon = getIcon('X');
const CheckIcon = getIcon('Check');
const EditIcon = getIcon('Edit');
const ClockIcon = getIcon('Clock');
const AlertTriangleIcon = getIcon('AlertTriangle');
const BellIcon = getIcon('Bell');
const TrashIcon = getIcon('Trash');
const InboxIcon = getIcon('Inbox');
const ActivityIcon = getIcon('Activity');
const ArchiveIcon = getIcon('Archive');
const HelpCircleIcon = getIcon('HelpCircle');
const FolderIcon = getIcon('Folder');
const UserPlusIcon = getIcon('UserPlus');
const UsersIcon = getIcon('Users');

// Sample initial data
const initialTasks = [
  {
    id: "task-1",
    title: "Design new dashboard UI",
    projectId: "project-1",
    status: "todo",
    priority: "high",
    assignedTo: {
      name: "Hello Alex",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80"
    },
    assignedToGroup: false,
    groupMembers: [],
    dueDate: "2023-05-28",
    description: "Create a modern dashboard interface with widgets for key metrics and activity feeds."
  },
  {
    id: "task-2",
    title: "Implement authentication API",
    status: "in-progress",
    priority: "medium",
    assignedTo: {
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    },
    assignedToGroup: true,
    groupMembers: [
      { id: 'user-1', name: 'Hello Alex', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80' },
      { id: 'user-2', name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80' }
    ],
    dueDate: "2023-05-30",
    projectId: "project-2",
    description: "Build a secure authentication API with JWT tokens, password reset, and account verification."
  },
  {
    id: "task-3",
    title: "Set up CI/CD pipeline",
    status: "review",
    priority: "high",
    assignedTo: {
      name: "Hello Alex",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80"
    },
    assignedToGroup: false,
    projectId: "project-1",
    dueDate: "2023-05-25",
    description: "Configure GitHub Actions for continuous integration and deployment to staging and production environments.",
    groupMembers: []
  },
  {
    id: "task-4",
    title: "Write unit tests for user module",
    status: "done",
    priority: "low",
    assignedTo: {
      name: "David Kim",
      avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80"
    },
    assignedToGroup: false,
    groupMembers: [],
    dueDate: "2023-05-22",
    projectId: "project-3",
    description: "Create comprehensive unit tests for the user management module including authentication, profile management, and permissions."
  },
  {
    id: "task-5",
    title: "Update component documentation",
    status: "todo",
    priority: "medium",
    assignedTo: {
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80"
    },
    assignedToGroup: false,
    groupMembers: [],
    dueDate: "2023-06-02",
    projectId: "project-2",
    description: "Update and expand the documentation for all UI components with usage examples and prop definitions."
  }
];

const colorsByStatus = {
  todo: {
    bg: "bg-slate-100 dark:bg-slate-800/50",
    border: "border-slate-200 dark:border-slate-700",
    header: "bg-slate-200/70 dark:bg-slate-800"
  },
  "in-progress": {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
    header: "bg-blue-100 dark:bg-blue-900/40"
  },
  review: {
    bg: "bg-purple-50 dark:bg-purple-900/20",
    border: "border-purple-200 dark:border-purple-800",
    header: "bg-purple-100 dark:bg-purple-900/40"
  },
  done: {
    bg: "bg-green-50 dark:bg-green-900/20",
    border: "border-green-200 dark:border-green-800",
    header: "bg-green-100 dark:bg-green-900/40"
  }
};

const priorityColors = {
  low: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  medium: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  high: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
};

const TaskCard = ({ task, onEdit, onDelete, onChangeStatus }) => {
  const { title, priority, assignedTo, assignedToGroup, groupMembers, dueDate, status, projectId } = task;
  const { projects } = useProjectContext();
  
  // Find project name
  const project = projects.find(p => p.id === projectId);
  const projectName = project ? project.name : "No Project";
  
  // Render assigned team members
  const renderAssignees = () => {
    if (assignedToGroup && groupMembers.length > 0) {
      return (
        <div className="flex items-center -space-x-2">
          {groupMembers.slice(0, 3).map((member, index) => (
            <div key={index} className="h-6 w-6 rounded-full overflow-hidden border-2 border-white dark:border-surface-800">
              <img 
                src={member.avatar}
                alt={member.name}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
          {groupMembers.length > 3 && <div className="h-6 w-6 rounded-full bg-primary-light flex items-center justify-center text-white text-xs">+{groupMembers.length - 3}</div>}
        </div>
      );
    }
    
    return (
      <div className="flex items-center space-x-1">
        <div className="h-6 w-6 rounded-full overflow-hidden bg-primary-light flex items-center justify-center text-white">
          {assignedTo.name === "Hello Alex" ? <UsersIcon className="h-4 w-4" /> : <img 
            src={assignedTo.avatar}
            alt={assignedTo.name}
            className="h-full w-full object-cover"
          />}
        </div>
        <span className="text-xs font-medium">{assignedTo.name}</span>
      </div>
    );
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`p-4 ${colorsByStatus[status].border} border rounded-lg mb-3 bg-white dark:bg-surface-800 shadow-sm hover:shadow-md transition-shadow duration-200`}
      whileHover={{ y: -2 }}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-medium text-surface-900 dark:text-surface-100 line-clamp-2">{title}</h3>
          <div className="flex items-center mt-1 text-xs text-surface-500">
            <FolderIcon className="h-3.5 w-3.5 mr-1" />
            <span>{projectName}</span>
          </div>
        </div>
        <div className="flex gap-1 ml-2">
          <button 
            onClick={() => onChangeStatus(task.id)}
            className="p-1.5 text-surface-500 hover:text-primary rounded-md hover:bg-surface-100 dark:hover:bg-surface-700"
          >
            <EditIcon className="h-4 w-4" />
          </button>
          <button 
            onClick={() => onDelete(task.id)}
            className="p-1.5 text-surface-500 hover:text-red-500 rounded-md hover:bg-surface-100 dark:hover:bg-surface-700"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          {renderAssignees()}
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[priority]}`}>
            {priority}
          </span>
          
          <div className="flex items-center text-xs text-surface-600 dark:text-surface-400">
            <ClockIcon className="h-3 w-3 mr-1" />
            <time>{new Date(dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</time>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const MainFeature = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const location = useLocation();
  const navigate = useNavigate();
  const { projects } = useProjectContext();
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: new Date().toISOString().split('T')[0],
    projectId: "",
    assignedToGroup: false,
    groupMembers: []
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [editingTaskId, setEditingTaskId] = useState(null);
  
  // Column definitions
  const columns = [
    { id: "todo", name: "To Do", icon: InboxIcon },
    { id: "in-progress", name: "In Progress", icon: ActivityIcon },
    { id: "review", name: "In Review", icon: HelpCircleIcon },
    { id: "done", name: "Completed", icon: ArchiveIcon }
  ];

  // Get selected project from URL query params
  const queryParams = new URLSearchParams(location.search);
  const selectedProjectId = queryParams.get('projectId');
  
  // Filter tasks by selected project
  const filteredTasks = selectedProjectId 
    ? tasks.filter(task => task.projectId === selectedProjectId)
    : tasks;
    
  // Update project filter
  const handleProjectChange = (projectId) => {
    if (projectId === "all") {
      navigate("/");
    } else {
      navigate(`/?projectId=${projectId}`);
    }
  };

  // Handle opening the form for adding a new task
  const handleAddNewClick = () => {
    setIsFormOpen(true);
    setEditingTaskId(null);
    setNewTask({
      title: "",
      status: "todo",
      description: "",
      priority: "medium",
      dueDate: new Date().toISOString().split('T')[0],
      projectId: selectedProjectId || (projects.length > 0 ? projects[0].id : ""),
      assignedToGroup: false,
      groupMembers: []
    });
    setFormErrors({});
    
    // If we don't have any projects, show a message and redirect
    if (projects.length === 0) {
      toast.error("Please create a project first");
      navigate("/projects");
      return;
    }
  };

  // Handle opening the form for editing an existing task
  const handleEditTask = (taskId) => {
    const taskToEdit = tasks.find(task => task.id === taskId);
    if (taskToEdit) {
      setNewTask({
        title: taskToEdit.title,
        status: taskToEdit.status,
        description: taskToEdit.description || "",
        priority: taskToEdit.priority,
        dueDate: taskToEdit.dueDate,
        projectId: taskToEdit.projectId,
        assignedToGroup: taskToEdit.assignedToGroup || false,
        groupMembers: taskToEdit.groupMembers || []
      });
      setEditingTaskId(taskId);
      setIsFormOpen(true);
      setFormErrors({});
    }
  };

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const errors = {};
    if (!newTask.title.trim()) {
      errors.title = "Task title is required";
    }
    if (!newTask.projectId) {
      errors.projectId = "Project is required";
    }
    if (!newTask.dueDate) {
      errors.dueDate = "Due date is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (editingTaskId) {
      // Update existing task
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === editingTaskId 
            ? { 
                ...task, 
                title: newTask.title,
                status: newTask.status,
                description: newTask.description,
                priority: newTask.priority,
                dueDate: newTask.dueDate,
                projectId: newTask.projectId,
                assignedToGroup: newTask.assignedToGroup,
                groupMembers: newTask.assignedToGroup ? newTask.groupMembers : []
              } 
            : task
        )
      );
      toast.success("Task updated successfully!");
    } else {
      // Add new task
      const newTaskObj = {
        id: `task-${Date.now()}`,
        title: newTask.title,
        status: newTask.status,
        description: newTask.description,
        priority: newTask.priority,
        dueDate: newTask.dueDate,
        projectId: newTask.projectId,
        assignedToGroup: newTask.assignedToGroup,
        groupMembers: newTask.assignedToGroup ? newTask.groupMembers : [],
        assignedTo: newTask.assignedToGroup ? null : {
          name: "Hello Alex",
          avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
        }
      };
      
      setTasks(prevTasks => [...prevTasks, newTaskObj]);
      toast.success("New task added!");
    }
    
    // Reset form
    setIsFormOpen(false);
    setEditingTaskId(null);
  };

  // Handle task deletion
  const handleDeleteTask = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    toast.success("Task deleted successfully!");
  };

  // Handle task status change (cycling through statuses)
  const handleChangeStatus = (taskId) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId) {
          const statusIndex = columns.findIndex(col => col.id === task.status);
          const nextStatusIndex = (statusIndex + 1) % columns.length;
          const newStatus = columns[nextStatusIndex].id;
          
          return { ...task, status: newStatus };
        }
        return task;
      })
    );
  };

  // Helper function to get tasks for a specific column
  const getTasksByStatus = (status) => {
    return filteredTasks.filter(task => task.status === status);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Task Board</h2>
          <p className="text-surface-600 dark:text-surface-400">Manage and track your team's tasks</p>
        </div>
        
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <select
              className="form-input pr-8 py-2"
              value={selectedProjectId || "all"}
              onChange={(e) => handleProjectChange(e.target.value)}
            >
              <option value="all">All Projects</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <FolderIcon className="h-5 w-5 text-surface-500" />
            </div>
          </div>
          
          <a href="/projects" className="btn btn-outline hidden sm:flex items-center gap-2 py-2">
            <FolderIcon className="h-5 w-5" />
            <span>Manage Projects</span>
          </a>
        
        <button 
          onClick={handleAddNewClick}
          className="btn btn-primary flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span className="hidden sm:inline">New Task</span>
        </button>
      </div>
      
      </div>
      {/* Task Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {columns.map(column => (
          <div 
            key={column.id}
            className={`${colorsByStatus[column.id].bg} rounded-xl border ${colorsByStatus[column.id].border}`}
          >
            <div className={`${colorsByStatus[column.id].header} px-4 py-3 rounded-t-xl flex items-center justify-between border-b ${colorsByStatus[column.id].border}`}>
              <div className="flex items-center gap-2">
                <column.icon className="h-5 w-5" />
                <h3 className="font-semibold">{column.name}</h3>
              </div>
              <span className="bg-white dark:bg-surface-800 text-sm font-medium text-surface-800 dark:text-white dark:opacity-100 px-2 py-0.5 rounded-full">
                {getTasksByStatus(column.id).length}
              </span>
            </div>
            
            <div className="p-3 min-h-[200px] max-h-[500px] overflow-y-auto">
              <AnimatePresence>
                {getTasksByStatus(column.id).map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onChangeStatus={handleChangeStatus}
                  />
                ))}
              </AnimatePresence>
              
              {getTasksByStatus(column.id).length === 0 && (
                <div className="text-center py-8 text-surface-500 dark:text-surface-400 flex flex-col items-center">
                  <AlertTriangleIcon className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">No tasks here</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* New Task Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsFormOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white dark:bg-surface-800 rounded-xl shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b dark:border-surface-700">
                <h3 className="text-xl font-semibold">
                  {editingTaskId ? "Edit Task" : "Create New Task"}
                </h3>
                <button 
                  onClick={() => setIsFormOpen(false)}
                  className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                >
                  <XIcon className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="task-title">
                    Project
                  </label>
                  <select
                    id="task-project"
                    name="projectId"
                    value={newTask.projectId}
                    onChange={handleInputChange}
                    className={`form-input ${formErrors.projectId ? 'border-red-500 dark:border-red-500' : ''}`}
                  >
                    <option value="">Select a project</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                  {formErrors.projectId && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.projectId}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="task-title">
                    Task Title
                  </label>
                  <input
                    type="text"
                    id="task-title"
                    name="title"
                    value={newTask.title}
                    onChange={handleInputChange}
                    placeholder="Enter task title"
                    className={`form-input ${formErrors.title ? 'border-red-500 dark:border-red-500' : ''}`}
                  />
                  {formErrors.title && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="task-description">
                    Description
                  </label>
                  <textarea
                    id="task-description"
                    name="description"
                    value={newTask.description}
                    onChange={handleInputChange}
                    placeholder="Enter task description"
                    className="form-input"
                    rows="3"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="task-status">
                      Status
                    </label>
                    <select
                      id="task-status"
                      name="status"
                      value={newTask.status}
                      onChange={handleInputChange}
                      className="form-input"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="review">In Review</option>
                      <option value="done">Completed</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="task-priority">
                      Priority
                    </label>
                    <select
                      id="task-priority"
                      name="priority"
                      value={newTask.priority}
                      onChange={handleInputChange}
                      className="form-input"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="task-due-date">
                    Due Date
                  </label>
                  <input
                    type="date"
                    id="task-due-date"
                    name="dueDate"
                    value={newTask.dueDate}
                    onChange={handleInputChange}
                    className={`form-input ${formErrors.dueDate ? 'border-red-500 dark:border-red-500' : ''}`}
                  />
                  {formErrors.dueDate && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.dueDate}</p>
                  )}
                </div>
                <div>
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="assign-to-group"
                      name="assignedToGroup"
                      checked={newTask.assignedToGroup}
                      onChange={(e) => handleInputChange({
                        target: { name: 'assignedToGroup', value: e.target.checked }
                      })}
                      className="mr-2 h-4 w-4 text-primary focus:ring-primary-light rounded"
                    />
                    <label htmlFor="assign-to-group" className="text-sm font-medium">
                      Assign to a group
                    </label>
                  </div>
                  
                  {newTask.assignedToGroup && (
                    <div className="flex items-center gap-2 p-3 bg-surface-100 dark:bg-surface-700 rounded-lg">
                      <UserPlusIcon className="h-5 w-5 text-surface-600 dark:text-surface-400" />
                      <p className="text-sm text-surface-600 dark:text-surface-400">
                        This task will be visible to all team members of the selected project.
                      </p>
                    </div>
                  )}
                  
                  {!newTask.assignedToGroup && (
                    <p className="text-sm text-surface-600 dark:text-surface-400 p-3 bg-surface-100 dark:bg-surface-700 rounded-lg">
                      This task will be assigned to a single team member.
                    </p>
                  )}
                </div>
                
                
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex items-center gap-2"
                  >
                    <CheckIcon className="h-5 w-5" />
                    <span>{editingTaskId ? "Update Task" : "Create Task"}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};



export default MainFeature;