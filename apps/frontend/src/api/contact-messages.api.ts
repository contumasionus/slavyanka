import apiClient from './client';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  adminReply: string | null;
  repliedAt: string | null;
  isRead: boolean;
  createdAt: string;
}

export const contactMessagesApi = {
  // Отправить отзыв (публичный)
  async create(data: { name: string; email: string; phone?: string; topic?: string; message: string }): Promise<ContactMessage> {
    const response = await apiClient.post('/contact-messages', data);
    return response.data;
  },

  // Получить все отзывы (админ)
  async getAll(): Promise<ContactMessage[]> {
    const response = await apiClient.get('/contact-messages');
    return response.data;
  },

  // Ответить на отзыв (админ)
  async reply(id: string, adminReply: string): Promise<ContactMessage> {
    const response = await apiClient.post(`/contact-messages/${id}/reply`, { adminReply });
    return response.data;
  },
};