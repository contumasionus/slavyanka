import { FastifyInstance } from 'fastify';
import prisma from '../db';
import { verifyAdmin } from '../middleware/auth';
import { ChatService } from '../services/chat.service';
import {
  createSession,
  getSessions,
  getSessionMessages,
  sendMessage,
  sendToUser,
  markAsRead,
  markAllAsRead,
  closeSession,
  getUnreadCount,
  getPublicMessages,
  getSessionByUser,
} from '../controllers/chat.controller';

export async function chatRoutes(app: FastifyInstance) {
  // Инициализируем сервис чата и добавляем в Fastify
  const chatService = new ChatService(prisma);
  app.decorate('chatService', chatService);

  // Создать новую сессию (публичный)
  app.post('/chat/sessions', createSession);

  // Получить список всех сессий (админ)
  app.get('/chat/sessions', { preHandler: [verifyAdmin] }, getSessions);

  // Получить сообщения сессии (админ)
  app.get('/chat/sessions/:id', { preHandler: [verifyAdmin] }, getSessionMessages);

  // Отправить сообщение в сессию (админ)
  app.post('/chat/sessions/:id/messages', sendMessage);

  // Отметить сообщение как прочитанное
  app.patch('/chat/messages/:id/read', markAsRead);

  // Отметить все сообщения сессии как прочитанные
  app.post('/chat/sessions/:id/read-all', markAllAsRead);

  // Закрыть сессию (админ)
  app.patch('/chat/sessions/:id/close', { preHandler: [verifyAdmin] }, closeSession);

  // Публичный эндпоинт для получения сообщений сессии (без авторизации)
  app.get('/chat/sessions/:id/public', getPublicMessages);

  // Получить сессию чата по userId (админ)
  app.get('/chat/sessions/user/:userId', { preHandler: [verifyAdmin] }, getSessionByUser);

  // Отправить сообщение пользователю по userId (админ)
  app.post('/chat/send-to-user/:userId', { preHandler: [verifyAdmin] }, sendToUser);

  // Получить количество непрочитанных сообщений (админ)
  app.get('/chat/unread-count', { preHandler: [verifyAdmin] }, getUnreadCount);
}

// Декларация типа для Fastify
declare module 'fastify' {
  interface FastifyInstance {
    chatService: ChatService;
  }
}