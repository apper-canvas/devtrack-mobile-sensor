import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import { useProjectContext } from '../context/ProjectContext';

const XIcon = getIcon('X');
const CheckIcon = getIcon('Check');
const UsersIcon = getIcon('Users');

const ProjectForm = ({ project, onClose }) => {
  const { addProject, updateProject } = useProjectContext();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
    teamSize: 1,
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 weeks from now
    teamMembers: []
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description,
        status: project.status,
        teamSize: project.teamSize,
        deadline: project.deadline,
        teamMembers: project.teamMembers || []
      });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Project name is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Project description is required";
    }
    if (!formData.deadline) {
      newErrors.deadline = "Deadline is required";
    } else if (new Date(formData.deadline) < new Date().setHours(0, 0, 0, 0)) {
      newErrors.deadline = "Deadline cannot be in the past";
    }
    if (formData.teamSize < 1) {
      newErrors.teamSize = "Team size must be at least 1";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (project) {
      // Update existing project
      updateProject({
        ...project,
        ...formData
      });
      toast.success("Project updated successfully!");
    } else {
      // Create new project
      addProject({
        id: `project-${Date.now()}`,
        ...formData,
        createdAt: new Date().toISOString(),
        taskCount: 0
      });
      toast.success("Project created successfully!");
    }
    
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
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
            {project ? "Edit Project" : "Create New Project"}
          </h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="project-name">
              Project Name
            </label>
            <input
              type="text"
              id="project-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter project name"
              className={`form-input ${errors.name ? 'border-red-500 dark:border-red-500' : ''}`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="project-description">
              Description
            </label>
            <textarea
              id="project-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter project description"
              rows="3"
              className={`form-input ${errors.description ? 'border-red-500 dark:border-red-500' : ''}`}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="project-status">
                Status
              </label>
              <select
                id="project-status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-input"
              >
                <option value="active">Active</option>
                <option value="on-hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="project-deadline">
                Deadline
              </label>
              <input
                type="date"
                id="project-deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className={`form-input ${errors.deadline ? 'border-red-500 dark:border-red-500' : ''}`}
              />
              {errors.deadline && <p className="text-red-500 text-xs mt-1">{errors.deadline}</p>}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="project-team-size">
              Team Size
            </label>
            <div className="flex items-center">
              <UsersIcon className="h-5 w-5 text-surface-500 mr-2" />
              <input
                type="number"
                id="project-team-size"
                name="teamSize"
                value={formData.teamSize}
                onChange={handleChange}
                min="1"
                className={`form-input ${errors.teamSize ? 'border-red-500 dark:border-red-500' : ''}`}
              />
            </div>
            {errors.teamSize && <p className="text-red-500 text-xs mt-1">{errors.teamSize}</p>}
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex items-center gap-2"
            >
              <CheckIcon className="h-5 w-5" />
              <span>{project ? "Update Project" : "Create Project"}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ProjectForm;