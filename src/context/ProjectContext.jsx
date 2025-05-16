import { createContext, useContext, useState, useEffect } from 'react';

const ProjectContext = createContext();

// Sample initial projects data
const initialProjects = [
  {
    id: 'project-1',
    name: 'Website Redesign',
    description: 'Redesign the company website with modern UI/UX principles and improved user flow',
    status: 'active',
    teamSize: 5,
    deadline: '2023-08-30',
    createdAt: '2023-05-10T14:30:00Z',
    taskCount: 8,
    teamMembers: [
      { id: 'user-1', name: 'Hello Alex', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80' },
      { id: 'user-2', name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80' }
    ]
  },
  {
    id: 'project-2',
    name: 'Mobile App Development',
    description: 'Create a mobile app version of our platform for iOS and Android users',
    status: 'active',
    teamSize: 7,
    deadline: '2023-10-15',
    createdAt: '2023-05-15T09:45:00Z',
    taskCount: 12,
    teamMembers: [
      { id: 'user-1', name: 'Hello Alex', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80' },
      { id: 'user-3', name: 'David Kim', avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80' }
    ]
  },
  {
    id: 'project-3',
    name: 'API Integration',
    description: 'Integrate third-party APIs for payment processing, analytics, and social media',
    status: 'on-hold',
    teamSize: 3,
    deadline: '2023-07-20',
    createdAt: '2023-04-22T11:20:00Z',
    taskCount: 5,
    teamMembers: [
      { id: 'user-2', name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80' }
    ]
  }
];

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState(initialProjects);
  const [loading, setLoading] = useState(true);

  // Simulate loading projects from an API
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Add a new project
  const addProject = (project) => {
    setProjects(prev => [...prev, project]);
  };

  // Update an existing project
  const updateProject = (updatedProject) => {
    setProjects(prev => 
      prev.map(project => 
        project.id === updatedProject.id ? updatedProject : project
      )
    );
  };

  // Delete a project
  const deleteProject = (projectId) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      loading,
      addProject,
      updateProject,
      deleteProject
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => useContext(ProjectContext);