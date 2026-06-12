import apiClient from './client';

export const reviewsApi = {
  async getByProduct(productId: string) {
    const response = await apiClient.get(`/reviews/product/${productId}`);
    return response.data;
  },

  async create(data: { productId: string; rating: number; text?: string; photo?: string }) {
    const response = await apiClient.post('/reviews', data);
    return response.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete(`/reviews/${id}`);
    return response.data;
  },
};