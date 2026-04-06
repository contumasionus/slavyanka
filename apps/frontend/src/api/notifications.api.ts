import apiClient from './client';

export const notificationsApi = {
  async subscribe(productId: string) {
    const response = await apiClient.post(`/notifications/subscribe/${productId}`);
    return response.data;
  },

  async unsubscribe(productId: string) {
    const response = await apiClient.delete(`/notifications/unsubscribe/${productId}`);
    return response.data;
  },

  async getMyNotifications() {
    const response = await apiClient.get('/notifications/my');
    return response.data;
  },

  async checkSubscription(productId: string) {
    const response = await apiClient.get(`/notifications/check/${productId}`);
    return response.data;
  },

  async getStats() {
    const response = await apiClient.get('/notifications/stats');
    return response.data;
  },

  async getProductSubscribers(productId: string) {
    const response = await apiClient.get(`/notifications/product/${productId}/subscribers`);
    return response.data;
  },
};