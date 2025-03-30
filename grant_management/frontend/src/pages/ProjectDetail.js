import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getProject, 
  updateProjectStep,
  submitProject
} from '../store/slices/projectSlice';
import ProjectStep from '../components/ProjectStep';

const ProjectDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProject, loading } = useSelector((state) => state.projects);
  const [activeStep, setActiveStep] = useState('basic_info');

  useEffect(() => {
    dispatch(getProject(id));
  }, [dispatch, id]);

  const handleStepUpdate = async (step, data) => {
    try {
      await dispatch(updateProjectStep({ projectId: id, step, data })).unwrap();
    } catch (error) {
      console.error('Failed to update step:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      await dispatch(submitProject(id)).unwrap();
    } catch (error) {
      console.error('Failed to submit project:', error);
    }
  };

  const steps = [
    { id: 'basic_info', title: 'Basic Information', completed: currentProject?.basic_info },
    { id: 'funding_details', title: 'Funding Details', completed: currentProject?.funding_details },
    { id: 'team_members', title: 'Team Members', completed: currentProject?.team_members },
    { id: 'project_documents', title: 'Project Documents', completed: currentProject?.project_documents },
    { id: 'agreements', title: 'Agreements', completed: currentProject?.agreements },
    { id: 'timelines', title: 'Timelines', completed: currentProject?.timelines },
    { id: 'reports', title: 'Reports', completed: currentProject?.reports },
    { id: 'resources', title: 'Resources', completed: currentProject?.resources },
    { id: 'risks', title: 'Risks', completed: currentProject?.risks },
    { id: 'publications', title: 'Publications', completed: currentProject?.publications },
    { id: 'funders', title: 'Funders', completed: currentProject?.funders },
  ];

  if (loading || !currentProject) {
    return <div>Loading project details...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{currentProject.title}</h1>
        {currentProject.approval_status === 'draft' && (
          <button
            onClick={handleSubmit}
            className="btn-primary"
            disabled={currentProject.get_completion_percentage() < 100}
          >
            Submit for Approval
          </button>
        )}
      </div>

      <div className="flex mb-6">
        <div className="w-1/4 pr-4">
          <div className="card">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Project Steps</h2>
            <nav className="space-y-1">
              {steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${
                    activeStep === step.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    {step.completed ? (
                      <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
                    ) : (
                      <span className="h-3 w-3 rounded-full bg-gray-300 mr-2"></span>
                    )}
                    {step.title}
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="w-3/4">
          <ProjectStep 
            step={activeStep} 
            project={currentProject} 
            onUpdate={handleStepUpdate} 
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;