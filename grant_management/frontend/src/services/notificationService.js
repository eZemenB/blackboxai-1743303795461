import api from './api';

export const fetchNotifications = async () => {
  try {
    const response = await api.get('/api/notifications/');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await api.post(`/api/notifications/${notificationId}/mark_as_read/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    const response = await api.post('/api/notifications/mark_all_as_read/');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};