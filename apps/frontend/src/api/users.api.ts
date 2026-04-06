import apiClient from './client';

export const usersApi = {
  async getAll() {
    const response = await apiClient.get('/users');
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  async updateRole(id: string, role: string) {
    const response = await apiClient.patch(`/users/${id}/role`, { role });
    return response.data;
  },

  async getProfile() {
    const response = await apiClient.get('/users/profile');
    return response.data;
  },

  async updateProfile(data: { name?: string; email?: string }) {
    const response = await apiClient.put('/users/profile', data);
    return response.data;
  },

  async getMyNotifications() {
    const response = await apiClient.get('/users/notifications');
    return response.data;
  },

  async getNotificationStats() {
    const response = await apiClient.get('/users/notification-stats');
    return response.data;
  },
};
