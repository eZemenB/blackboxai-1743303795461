import api from './api';
import { jwtDecode } from 'jwt-decode';

export const login = async (email, password) => {
  try {
    const response = await api.post('/api/auth/login/', { email, password });
    const { access } = response.data;
    localStorage.setItem('token', access);
    const user = await getUser();
    return { token: access, user };
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/api/auth/register/', userData);
    const { access } = response.data;
    localStorage.setItem('token', access);
    const user = await getUser();
    return { token: access, user };
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    const decoded = jwtDecode(token);
    const response = await api.get(`/api/auth/user/${decoded.user_id}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const refreshToken = async () => {
  try {
    const response = await api.post('/api/auth/token/refresh/');
    const { access } = response.data;
    localStorage.setItem('token', access);
    return access;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};