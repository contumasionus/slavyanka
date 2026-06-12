import apiClient from './client';

export const authApi = {
  async login(email: string, password: string) {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  async register(email: string, password: string, name: string) {
    const response = await apiClient.post('/auth/register', { email, password, name });
    return response.data;
  },

  async getMe() {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  async sendVerification(email: string) {
    const response = await apiClient.post('/auth/send-verification', { email });
    return response.data;
  },

  async verifyCode(email: string, code: string) {
    const response = await apiClient.post('/auth/verify-code', { email, code });
    return response.data;
  },
};