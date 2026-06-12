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

  async getAll(request: FastifyRequest, reply: FastifyReply) {
    const users = await this.usersService.findAll();
    reply.send(users);
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { id: string };
    const user = await this.usersService.findById(params.id);
    if (!user) {
      reply.status(404).send({ error: 'User not found' });
      return;
    }
    reply.send(user);
  }

  async updateRole(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { id: string };
    const body = request.body as { role: string };
    const user = await this.usersService.updateRole(params.id, body.role);
    reply.send(user);
  }

  async getProfile(request: FastifyRequest, reply: FastifyReply) {
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

  async updateProfile(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = request.user as { id: string };
      const body = request.body as { name?: string; email?: string };

      // Серверная валидация имени
      if (body.name !== undefined) {
        const cleaned = body.name.replace(/[^а-яА-ЯёЁ]/g, '');
        const sanitizedName = cleaned ? cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase() : '';
        body.name = sanitizedName;

        const nameRegex = /^[А-Я][а-яёЁ]{1,29}$/;
        if (!sanitizedName || !nameRegex.test(sanitizedName)) {
          reply.status(400).send({ error: 'Имя должно содержать только русские буквы и начинаться с заглавной (2-30 символов)' });
          return;
        }
      }

      // Серверная валидация email (whitelist)
      if (body.email !== undefined) {
        const sanitizedEmail = body.email.toLowerCase().trim();
        body.email = sanitizedEmail;

        const allowedDomains = [
          'mail.ru', 'gmail.com', 'yandex.ru', 'yandex.com',
          'inbox.ru', 'bk.ru', 'list.ru', 'outlook.com',
          'hotmail.com', 'icloud.com',
        ];

        const parts = sanitizedEmail.split('@');
        if (parts.length !== 2 || !parts[0] || !parts[1] || !allowedDomains.includes(parts[1])) {
          reply.status(400).send({ error: 'Неверно введена почта' });
          return;
        }
      }

      const updatedUser = await this.usersService.update(user.id, body);
      reply.send(updatedUser);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  }

  async getMyNotifications(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = request.user as { id: string };
      const notifications = await this.notificationsService.getUserNotifications(user.id);
      reply.send(notifications);
    } catch (error) {
      reply.status(500).send({ error: (error as Error).message });
    }
  }

  async getNotificationStats(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = request.user as { id: string };
      const stats = await this.notificationsService.getNotificationStats(user.id);
      reply.send(stats);
    } catch (error) {
      reply.status(500).send({ error: (error as Error).message });
    }
  }
}