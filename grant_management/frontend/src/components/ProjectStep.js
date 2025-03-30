import React, { useState, useEffect } from 'react';
import { DocumentTextIcon, UserGroupIcon, CurrencyDollarIcon, CalendarIcon, ChartBarIcon, ExclamationIcon, BookOpenIcon } from '@heroicons/react/outline';

const ProjectStep = ({ step, project, onUpdate }) => {
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (project[step]) {
      setFormData(project[step]);
    } else {
      setFormData(getDefaultData(step));
    }
  }, [step, project]);

  const getDefaultData = (step) => {
    switch (step) {
      case 'basic_info':
        return {
          description: '',
          objectives: '',
          expected_outcomes: '',
        };
      case 'funding_details':
        return {
          budget: '',
          funding_source: '',
          duration: '',
        };
      case 'team_members':
        return {
          members: [],
        };
      // Add default data for other steps
      default:
        return {};
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({
      ...formData,
      [field]: newArray,
    });
  };

  const handleAddItem = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], ''],
    });
  };

  const handleRemoveItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [field]: newArray,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(step, formData);
    setIsEditing(false);
  };

  const getStepIcon = () => {
    switch (step) {
      case 'basic_info':
        return <DocumentTextIcon className="h-5 w-5 text-blue-500" />;
      case 'funding_details':
        return <CurrencyDollarIcon className="h-5 w-5 text-green-500" />;
      case 'team_members':
        return <UserGroupIcon className="h-5 w-5 text-purple-500" />;
      case 'timelines':
        return <CalendarIcon className="h-5 w-5 text-yellow-500" />;
      case 'risks':
        return <ExclamationIcon className="h-5 w-5 text-red-500" />;
      case 'publications':
        return <BookOpenIcon className="h-5 w-5 text-indigo-500" />;
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 'basic_info':
        return 'Basic Information';
      case 'funding_details':
        return 'Funding Details';
      case 'team_members':
        return 'Team Members';
      case 'project_documents':
        return 'Project Documents';
      case 'agreements':
        return 'Agreements';
      case 'timelines':
        return 'Timelines';
      case 'reports':
        return 'Reports';
      case 'resources':
        return 'Resources';
      case 'risks':
        return 'Risks';
      case 'publications':
        return 'Publications';
      case 'funders':
        return 'Funders';
      default:
        return step.replace('_', ' ');
    }
  };

  return (
    <div className="card">
      <div className="flex items-center mb-4">
        {getStepIcon()}
        <h2 className="text-lg font-medium text-gray-900 ml-2">
          {getStepTitle()}
        </h2>
      </div>

      {!isEditing && project[step] ? (
        <div>
          {/* Display step data */}
          {step === 'basic_info' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1 text-sm text-gray-900">{formData.description}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Objectives</h3>
                <p className="mt-1 text-sm text-gray-900">{formData.objectives}</p>
              </div>
            </div>
          )}
          
          {step === 'team_members' && (
            <div className="space-y-2">
              {formData.members?.map((member, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-900">{member}</span>
                </div>
              ))}
            </div>
          )}

          {/* Add display for other steps */}

          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 btn-secondary"
          >
            Edit
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 'basic_info' && (
            <>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description || ''}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label htmlFor="objectives" className="block text-sm font-medium text-gray-700 mb-1">
                  Objectives
                </label>
                <textarea
                  id="objectives"
                  name="objectives"
                  rows={3}
                  value={formData.objectives || ''}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
            </>
          )}

          {step === 'team_members' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Team Members
              </label>
              {formData.members?.map((member, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={member}
                    onChange={(e) => handleArrayChange('members', index, e.target.value)}
                    className="input-field flex-1"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveItem('members', index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddItem('members')}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                + Add Member
              </button>
            </div>
          )}

          {/* Add form fields for other steps */}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Save
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProjectStep;