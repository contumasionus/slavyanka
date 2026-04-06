import apiClient from './client';

export const visitsApi = {
  async track() {
    const response = await apiClient.post('/visits/track');
    return response.data;
  },

  async getStats() {
    const response = await apiClient.get('/visits/stats');
    return response.data;
  },

  async getRecent(limit?: number) {
    const params = limit ? `?limit=${limit}` : '';
    const response = await apiClient.get(`/visits/recent${params}`);
    return response.data;
  },
};