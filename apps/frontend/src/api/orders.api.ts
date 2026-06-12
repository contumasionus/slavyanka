import apiClient from './client';

export const ordersApi = {
  async getMyOrders() {
    const response = await apiClient.get('/orders/my');
    return response.data;
  },

  async create(data: any) {
    const response = await apiClient.post('/orders', data);
    return response.data;
  },

  async markReceived(orderId: string) {
    const response = await apiClient.patch(`/orders/${orderId}/received`);
    return response.data;
  },

  async markNotDelivered(orderId: string) {
    const response = await apiClient.patch(`/orders/${orderId}/not-delivered`);
    return response.data;
  },

  // Admin
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

  async delete(id: string) {
    const response = await apiClient.delete(`/orders/${id}`);
    return response.data;
  },
};