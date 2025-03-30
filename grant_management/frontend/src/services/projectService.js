import api from './api';

export const fetchProjects = async () => {
  try {
    const response = await api.get('/api/projects/');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createProject = async (projectData) => {
  try {
    const response = await api.post('/api/projects/', projectData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getProject = async (projectId) => {
  try {
    const response = await api.get(`/api/projects/${projectId}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateProjectStep = async (projectId, step, data) => {
  try {
    const response = await api.post(
      `/api/projects/${projectId}/update_step/`, 
      { step, data }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const submitProject = async (projectId) => {
  try {
    const response = await api.post(`/api/projects/${projectId}/submit/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const approveProject = async (projectId) => {
  try {
    const response = await api.post(`/api/projects/${projectId}/approve/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const rejectProject = async (projectId, reason) => {
  try {
    const response = await api.post(`/api/projects/${projectId}/reject/`, { reason });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};