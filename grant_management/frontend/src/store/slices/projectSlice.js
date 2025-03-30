import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/projects/');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/projects/', projectData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateProjectStep = createAsyncThunk(
  'projects/updateStep',
  async ({ projectId, step, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/projects/${projectId}/update_step/`, { step, data });
      return { projectId, step, data: response.data };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const submitProject = createAsyncThunk(
  'projects/submitProject',
  async (projectId, { rejectWithValue }) => {
    try {
      await api.post(`/api/projects/${projectId}/submit/`);
      return projectId;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    projects: [],
    currentProject: null,
    loading: false,
    error: null
  },
  reducers: {
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.projects = action.payload;
        state.loading = false;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      // Create Project
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.unshift(action.payload);
        state.currentProject = action.payload;
        state.loading = false;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      // Update Step
      .addCase(updateProjectStep.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProjectStep.fulfilled, (state, action) => {
        const { projectId, step, data } = action.payload;
        const project = state.projects.find(p => p.id === projectId) || state.currentProject;
        if (project) {
          project[step] = data;
          project.completion_status = data.completion_status;
        }
        state.loading = false;
      })
      .addCase(updateProjectStep.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      // Submit Project
      .addCase(submitProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitProject.fulfilled, (state, action) => {
        const project = state.projects.find(p => p.id === action.payload) || state.currentProject;
        if (project) {
          project.approval_status = 'submitted';
          project.submitted_at = new Date().toISOString();
        }
        state.loading = false;
      })
      .addCase(submitProject.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  }
});

export const { setCurrentProject, clearError } = projectSlice.actions;
export default projectSlice.reducer;