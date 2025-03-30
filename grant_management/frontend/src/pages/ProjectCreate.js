import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../store/slices/projectSlice';
import { fetchCampuses } from '../services/projectService';

const ProjectCreate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.projects);
  const [formData, setFormData] = useState({
    title: '',
    campus: '',
    collage: '',
    department: '',
  });
  const [campuses, setCampuses] = useState([]);
  const [collages, setCollages] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const loadCampuses = async () => {
      try {
        const response = await fetchCampuses();
        setCampuses(response.data);
      } catch (error) {
        console.error('Failed to load campuses:', error);
      }
    };
    loadCampuses();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCampusChange = async (e) => {
    const campusId = e.target.value;
    setFormData({
      ...formData,
      campus: campusId,
      collage: '',
      department: '',
    });
    if (campusId) {
      try {
        const response = await fetchCollages(campusId);
        setCollages(response.data);
      } catch (error) {
        console.error('Failed to load collages:', error);
      }
    } else {
      setCollages([]);
      setDepartments([]);
    }
  };

  const handleCollageChange = async (e) => {
    const collageId = e.target.value;
    setFormData({
      ...formData,
      collage: collageId,
      department: '',
    });
    if (collageId) {
      try {
        const response = await fetchDepartments(collageId);
        setDepartments(response.data);
      } catch (error) {
        console.error('Failed to load departments:', error);
      }
    } else {
      setDepartments([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const project = await dispatch(createProject(formData)).unwrap();
      navigate(`/projects/${project.id}`);
    } catch (error) {
      console.error('Project creation failed:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Project</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Project Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter project title"
              />
            </div>

            <div>
              <label htmlFor="campus" className="block text-sm font-medium text-gray-700 mb-1">
                Campus
              </label>
              <select
                id="campus"
                name="campus"
                required
                value={formData.campus}
                onChange={handleCampusChange}
                className="input-field"
              >
                <option value="">Select Campus</option>
                {campuses.map((campus) => (
                  <option key={campus.id} value={campus.id}>
                    {campus.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="collage" className="block text-sm font-medium text-gray-700 mb-1">
                College
              </label>
              <select
                id="collage"
                name="collage"
                required
                value={formData.collage}
                onChange={handleCollageChange}
                className="input-field"
                disabled={!formData.campus}
              >
                <option value="">Select College</option>
                {collages.map((collage) => (
                  <option key={collage.id} value={collage.id}>
                    {collage.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                id="department"
                name="department"
                required
                value={formData.department}
                onChange={handleChange}
                className="input-field"
                disabled={!formData.collage}
              >
                <option value="">Select Department</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectCreate;