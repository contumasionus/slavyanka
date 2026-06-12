import { FastifyInstance } from 'fastify';
import { verifyAdmin } from '../middleware/auth';
import { createMessage, getMessages, replyToMessage } from '../controllers/contact-messages.controller';

export async function contactMessagesRoutes(app: FastifyInstance) {
  // Создать отзыв (публичный)
  app.post('/contact-messages', createMessage);

  // Получить все отзывы (админ)
  app.get('/contact-messages', { preHandler: [verifyAdmin] }, getMessages);

  // Ответить на отзыв (админ)
  app.post('/contact-messages/:id/reply', { preHandler: [verifyAdmin] }, replyToMessage);
}