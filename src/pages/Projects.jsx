import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import ProjectCard from '../components/ProjectCard';
import ProjectForm from '../components/ProjectForm';
import { useProjectContext } from '../context/ProjectContext';

// Icon declarations
const PlusIcon = getIcon('Plus');
const SearchIcon = getIcon('Search');
const FilterIcon = getIcon('Filter');

const Projects = () => {
  const { projects, loading } = useProjectContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter projects based on search term and status filter
  useEffect(() => {
    let result = projects;
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(project => 
        project.name.toLowerCase().includes(term) || 
        project.description.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(project => project.status === statusFilter);
    }
    
    setFilteredProjects(result);
  }, [projects, searchTerm, statusFilter]);

  const handleAddNew = () => {
    setEditingProject(null);
    setIsFormOpen(true);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProject(null);
  };

  return (
    <div className="space-y-8 pb-12">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-8"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Projects</h1>
            <p className="text-surface-600 dark:text-surface-400">Manage your projects and team tasks</p>
          </div>
          <button 
            onClick={handleAddNew}
            className="btn btn-primary flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>New Project</span>
          </button>
        </div>
      </motion.section>

      {/* Filters & Search */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-surface-400" />
            </div>
            <input
              type="text"
              placeholder="Search projects..."
              className="form-input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <FilterIcon className="h-5 w-5 text-surface-500" />
            <select
              className="form-input py-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="on-hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </motion.section>

      {/* Projects Grid */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-2 text-surface-600 dark:text-surface-400">Loading projects...</p>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={() => handleEdit(project)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-surface-100 dark:bg-surface-800 rounded-full p-4 inline-block mb-4">
              <FilterIcon className="h-10 w-10 text-surface-500" />
            </div>
            {searchTerm || statusFilter !== 'all' ? (
              <>
                <h3 className="text-xl font-semibold">No matching projects</h3>
                <p className="text-surface-600 dark:text-surface-400 mt-2">
                  Try changing your search or filter criteria
                </p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                  className="mt-4 btn btn-outline"
                >
                  Clear Filters
                </button>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold">No projects yet</h3>
                <p className="text-surface-600 dark:text-surface-400 mt-2">
                  Create your first project to get started
                </p>
                <button 
                  onClick={handleAddNew}
                  className="mt-4 btn btn-primary"
                >
                  Create Project
                </button>
              </>
            )}
          </div>
        )}
      </motion.section>

      {isFormOpen && <ProjectForm project={editingProject} onClose={handleCloseForm} />}
    </div>
  );
};

export default Projects;