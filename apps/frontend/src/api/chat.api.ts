import apiClient from './client';
import type { ChatSession, ChatMessage } from '../types/chat';

export const chatApi = {
  /**
   * Создать новую сессию чата
   */
  async createSession(userName?: string, userId?: string): Promise<ChatSession> {
    const guestId = 'guest-' + Date.now();
    localStorage.setItem('chat-guest-id', guestId);
    const body: any = {
      guestId,
      userName: userName || 'Гость',
    };
    if (userId) {
      body.userId = userId;
    }
    const response = await apiClient.post('/chat/sessions', body);
    return response.data;
  },

  /**
   * Получить все сессии (админ)
   */
  async getSessions(): Promise<ChatSession[]> {
    const response = await apiClient.get('/chat/sessions');
    return response.data;
  },

  /**
   * Получить сообщения сессии (админ)
   */
  async getSessionMessages(sessionId: string): Promise<ChatSession> {
    const response = await apiClient.get(`/chat/sessions/${sessionId}`);
    return response.data;
  },

  /**
   * Отправить сообщение
   */
  async sendMessage(
    sessionId: string,
    content: string,
    senderType: 'user' | 'admin' = 'user',
    attachment?: string
  ): Promise<ChatMessage> {
    const response = await apiClient.post(`/chat/sessions/${sessionId}/messages`, {
      content,
      senderType,
      attachment,
    });
    return response.data;
  },

  /**
   * Отметить сообщение как прочитанное
   */
  async markAsRead(messageId: string): Promise<ChatMessage> {
    const response = await apiClient.patch(`/chat/messages/${messageId}/read`);
    return response.data;
  },

  /**
   * Отметить все сообщения сессии как прочитанные
   */
  async markAllAsRead(sessionId: string, senderType: string): Promise<void> {
    await apiClient.post(`/chat/sessions/${sessionId}/read-all`, { senderType });
  },

  /**
   * Закрыть сессию (админ)
   */
  async closeSession(sessionId: string): Promise<ChatSession> {
    const response = await apiClient.patch(`/chat/sessions/${sessionId}/close`);
    return response.data;
  },

  /**
   * Получить сообщения сессии через публичный endpoint (без авторизации)
   */
  async getPublicMessages(sessionId: string, guestId: string): Promise<ChatSession> {
    const response = await apiClient.get(`/chat/sessions/${sessionId}/public`, {
      params: { guestId },
    });
    return response.data;
  },

  /**
   * Отправить сообщение пользователю по userId (админ)
   */
  async sendToUser(userId: string, content: string): Promise<ChatMessage> {
    const response = await apiClient.post(`/chat/send-to-user/${userId}`, { content });
    return response.data;
  },

  /**
   * Получить количество непрочитанных сообщений (админ)
   */
  async getUnreadCount(): Promise<{ count: number }> {
    const response = await apiClient.get('/chat/unread-count');
    return response.data;
  },
};
