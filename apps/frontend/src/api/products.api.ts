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

  async create(data: { name: string; description?: string; price: number; weight?: string; imageUrl?: string; categoryId: string; inStock?: boolean; deliveryDate?: string }) {
    const response = await apiClient.post('/products', data);
    return response.data;
  },

  async update(id: string, data: Partial<{ name: string; description?: string; price: number; weight?: string; imageUrl?: string; categoryId: string; inStock?: boolean; deliveryDate?: string }>) {
    const response = await apiClient.put(`/products/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },
};