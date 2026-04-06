import { FastifyInstance } from 'fastify';
import { UsersController } from '../controllers/users.controller';
import { UsersService } from '../services/users.service';
import { NotificationsService } from '../services/notifications.service';
import { VisitsService } from '../services/visits.service';
import { verifyAdmin, verifyJWT } from '../middleware/auth';

export async function usersRoutes(server: FastifyInstance) {
  const usersService = new UsersService(server.prisma);
  const notificationsService = new NotificationsService(server.prisma);
  const visitsService = new VisitsService(server.prisma);
  const usersController = new UsersController(usersService, notificationsService, visitsService);

  server.get('/', {
    preHandler: verifyAdmin,
  }, usersController.getAll.bind(usersController));

  server.get('/:id', {
    preHandler: verifyAdmin,
  }, usersController.getById.bind(usersController));

  server.patch('/:id/role', {
    preHandler: verifyAdmin,
    schema: {
      body: {
        type: 'object',
        required: ['role'],
        properties: {
          role: { type: 'string', enum: ['admin', 'customer'] },
        },
      },
    },
  }, usersController.updateRole.bind(usersController));

  server.get('/profile', {
    preHandler: verifyJWT,
  }, usersController.getProfile.bind(usersController));

  server.put('/profile', {
    preHandler: verifyJWT,
    schema: {
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
        },
      },
    },
  }, usersController.updateProfile.bind(usersController));

  server.get('/notifications', {
    preHandler: verifyJWT,
  }, usersController.getMyNotifications.bind(usersController));

  server.get('/notification-stats', {
    preHandler: verifyJWT,
  }, usersController.getNotificationStats.bind(usersController));
}