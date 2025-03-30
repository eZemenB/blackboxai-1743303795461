import React from 'react';
import { Link } from 'react-router-dom';
import { ClockIcon, CheckCircleIcon, DocumentTextIcon } from '@heroicons/react/outline';

const ProjectCard = ({ project }) => {
  const getStatusColor = () => {
    switch (project.approval_status) {
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          <Link to={`/projects/${project.id}`} className="hover:text-blue-600">
            {project.title}
          </Link>
        </h3>
        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor()}`}>
          {project.approval_status}
        </span>
      </div>
      
      <div className="flex items-center text-sm text-gray-500 mb-2">
        <DocumentTextIcon className="h-4 w-4 mr-1" />
        {project.department?.name || 'No department'}
      </div>

      <div className="flex items-center text-sm text-gray-500 mb-4">
        <ClockIcon className="h-4 w-4 mr-1" />
        {new Date(project.created_at).toLocaleDateString()}
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div 
          className="bg-blue-600 h-2.5 rounded-full" 
          style={{ width: `${project.get_completion_percentage()}%` }}
        ></div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {project.get_completion_percentage()}% complete
        </span>
        {project.approval_status === 'draft' && (
          <Link
            to={`/projects/${project.id}`}
            className="text-sm btn-secondary"
          >
            Continue
          </Link>
        )}
        {project.approval_status === 'submitted' && (
          <span className="text-sm text-blue-600">
            <CheckCircleIcon className="h-4 w-4 inline mr-1" />
            Submitted
          </span>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;