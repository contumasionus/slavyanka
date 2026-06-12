import apiClient from './client';

export const productsApi = {
  async getAll() {
    const response = await apiClient.get('/products');
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  async getByCategory(slug: string) {
    const response = await apiClient.get(`/products/category/${slug}`);
    return response.data;
  },

  async getPromo() {
    const response = await apiClient.get('/products/promo');
    return response.data;
  },

  async search(query: string) {
    const response = await apiClient.get(`/products/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  async getViewed() {
    const response = await apiClient.get('/products/viewed/history');
    return response.data;
  },

  async recordView(productId: string) {
    const response = await apiClient.post('/products/viewed/record', { productId });
    return response.data;
  },

  async create(data: any) {
    const response = await apiClient.post('/products', data);
    return response.data;
  },

  async update(id: string, data: any) {
    const response = await apiClient.put(`/products/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },
};