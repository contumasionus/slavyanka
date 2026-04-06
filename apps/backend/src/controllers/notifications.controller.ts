import { FastifyRequest, FastifyReply } from 'fastify';
import { NotificationsService } from '../services/notifications.service';

export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  async subscribe(request: any, reply: FastifyReply) {
    try {
      const user = request.user as { id: string };
      const notification = await this.notificationsService.subscribe(user.id, request.params.productId);
      reply.status(201).send(notification);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  }

  async unsubscribe(request: any, reply: FastifyReply) {
    try {
      const user = request.user as { id: string };
      await this.notificationsService.unsubscribe(user.id, request.params.productId);
      reply.send({ message: 'Unsubscribed successfully' });
    } catch (error) {
      reply.status(404).send({ error: (error as Error).message });
    }
  }

  async getMyNotifications(request: any, reply: FastifyReply) {
    try {
      const user = request.user as { id: string };
      const notifications = await this.notificationsService.getUserNotifications(user.id);
      reply.send(notifications);
    } catch (error) {
      reply.status(500).send({ error: (error as Error).message });
    }
  }

  async checkSubscription(request: any, reply: FastifyReply) {
    try {
      const user = request.user as { id: string };
      const isSubscribed = await this.notificationsService.isSubscribed(user.id, request.params.productId);
      reply.send({ isSubscribed });
    } catch (error) {
      reply.status(500).send({ error: (error as Error).message });
    }
  }

  async getStats(request: any, reply: FastifyReply) {
    try {
      const user = request.user as { id: string };
      const stats = await this.notificationsService.getNotificationStats(user.id);
      reply.send(stats);
    } catch (error) {
      reply.status(500).send({ error: (error as Error).message });
    }
  }

  async getProductSubscribers(request: any, reply: FastifyReply) {
    try {
      const subscribers = await this.notificationsService.getProductSubscribers(request.params.productId);
      reply.send(subscribers);
    } catch (error) {
      reply.status(500).send({ error: (error as Error).message });
    }
  }
}