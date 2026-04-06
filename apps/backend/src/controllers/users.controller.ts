import { FastifyRequest, FastifyReply } from 'fastify';
import { UsersService } from '../services/users.service';
import { NotificationsService } from '../services/notifications.service';
import { VisitsService } from '../services/visits.service';

export class UsersController {
  constructor(
    private usersService: UsersService,
    private notificationsService: NotificationsService,
    private visitsService: VisitsService
  ) {}

  async getAll(request: any, reply: FastifyReply) {
    const users = await this.usersService.findAll();
    reply.send(users);
  }

  async getById(request: any, reply: FastifyReply) {
    const user = await this.usersService.findById(request.params.id);
    if (!user) {
      reply.status(404).send({ error: 'User not found' });
      return;
    }
    reply.send(user);
  }

  async updateRole(request: any, reply: FastifyReply) {
    const user = await this.usersService.updateRole(request.params.id, request.body.role);
    reply.send(user);
  }

  async getProfile(request: any, reply: FastifyReply) {
    try {
      const user = request.user as { id: string };
      const userData = await this.usersService.findById(user.id);
      if (!userData) {
        reply.status(404).send({ error: 'User not found' });
        return;
      }
      const visitStats = await this.visitsService.getVisitStats(user.id);
      const notificationStats = await this.notificationsService.getNotificationStats(user.id);

      reply.send({
        ...userData,
        visitCount: visitStats.totalVisits,
        notificationCount: notificationStats.totalNotifications,
      });
    } catch (error) {
      reply.status(500).send({ error: (error as Error).message });
    }
  }

  async updateProfile(request: any, reply: FastifyReply) {
    try {
      const user = request.user as { id: string };
      const updatedUser = await this.usersService.update(user.id, request.body);
      reply.send(updatedUser);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
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

  async getNotificationStats(request: any, reply: FastifyReply) {
    try {
      const user = request.user as { id: string };
      const stats = await this.notificationsService.getNotificationStats(user.id);
      reply.send(stats);
    } catch (error) {
      reply.status(500).send({ error: (error as Error).message });
    }
  }
}