import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../store/slices/projectSlice';
import { Link } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { projects, loading } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Projects</h1>
        <Link
          to="/projects/new"
          className="btn-primary"
        >
          New Project
        </Link>
      </div>

      {loading ? (
        <div>Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">You don't have any projects yet</p>
          <Link
            to="/projects/new"
            className="btn-primary"
          >
            Create your first project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;