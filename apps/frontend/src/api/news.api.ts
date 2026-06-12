import apiClient from './client';

export const newsApi = {
  async getAll() {
    const response = await apiClient.get('/news');
    return response.data;
  },

  async getBySlug(slug: string) {
    const response = await apiClient.get(`/news/${slug}`);
    return response.data;
  },

  async adminGetAll() {
    const response = await apiClient.get('/news/admin/all');
    return response.data;
  },

  async adminGetById(id: string) {
    const response = await apiClient.get(`/news/admin/${id}`);
    return response.data;
  },

  async create(data: any) {
    const response = await apiClient.post('/news', data);
    return response.data;
  },

  async update(id: string, data: any) {
    const response = await apiClient.put(`/news/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete(`/news/${id}`);
    return response.data;
  },
};