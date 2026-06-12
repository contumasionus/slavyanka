import { FastifyInstance } from 'fastify';
import prisma from '../db';
import { NotificationsController } from '../controllers/notifications.controller';
import { NotificationsService } from '../services/notifications.service';
import { verifyJWT } from '../middleware/auth';

export async function notificationsRoutes(server: FastifyInstance) {
  const notificationsService = new NotificationsService(prisma);
  const notificationsController = new NotificationsController(notificationsService);

  server.post('/subscribe/:productId', {
    preHandler: verifyJWT,
  }, notificationsController.subscribe.bind(notificationsController));

  server.delete('/unsubscribe/:productId', {
    preHandler: verifyJWT,
  }, notificationsController.unsubscribe.bind(notificationsController));

  server.get('/my', {
    preHandler: verifyJWT,
  }, notificationsController.getMyNotifications.bind(notificationsController));

  server.get('/check/:productId', {
    preHandler: verifyJWT,
  }, notificationsController.checkSubscription.bind(notificationsController));

  server.get('/stats', {
    preHandler: verifyJWT,
  }, notificationsController.getStats.bind(notificationsController));

  server.get('/product/:productId/subscribers', {
    preHandler: verifyJWT,
  }, notificationsController.getProductSubscribers.bind(notificationsController));
}