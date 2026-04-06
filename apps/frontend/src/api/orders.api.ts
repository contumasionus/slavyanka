import apiClient from './client';

export const ordersApi = {
  async getAll() {
    const response = await apiClient.get('/orders');
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },

  async updateStatus(id: string, status: string) {
    const response = await apiClient.patch(`/orders/${id}/status`, { status });
    return response.data;
  },
};