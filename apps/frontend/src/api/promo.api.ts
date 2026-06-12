import apiClient from './client';

export const promoApi = {
  async generate(email: string) {
    const response = await apiClient.post('/promo/generate', { email });
    return response.data;
  },

  async validate(code: string) {
    const response = await apiClient.post('/promo/validate', { code });
    return response.data;
  },
};
