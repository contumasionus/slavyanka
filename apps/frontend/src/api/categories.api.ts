import apiClient from './client';

export const categoriesApi = {
  async getAll() {
    const response = await apiClient.get('/categories');
    return response.data;
  },

  async getBySlug(slug: string) {
    const response = await apiClient.get(`/categories/${slug}`);
    return response.data;
  },

  async create(data: { name: string; slug: string; description?: string; imageUrl?: string }) {
    const response = await apiClient.post('/categories', data);
    return response.data;
  },

  async update(id: string, data: Partial<{ name: string; slug: string; description?: string; imageUrl?: string }>) {
    const response = await apiClient.put(`/categories/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete(`/categories/${id}`);
    return response.data;
  },
};