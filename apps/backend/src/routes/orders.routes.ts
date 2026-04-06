import { FastifyInstance } from 'fastify';
import { OrdersController } from '../controllers/orders.controller';
import { OrdersService } from '../services/orders.service';
import { verifyAdmin } from '../middleware/auth';

export async function ordersRoutes(server: FastifyInstance) {
  const ordersService = new OrdersService(server.prisma);
  const ordersController = new OrdersController(ordersService);

  server.get('/', {
    preHandler: verifyAdmin,
  }, ordersController.getAll.bind(ordersController));

  server.get('/:id', {
    preHandler: verifyAdmin,
  }, ordersController.getById.bind(ordersController));

  server.patch('/:id/status', {
    preHandler: verifyAdmin,
    schema: {
      body: {
        type: 'object',
        required: ['status'],
        properties: {
          status: { type: 'string', enum: ['new', 'processing', 'ready', 'completed'] },
        },
      },
    },
  }, ordersController.updateStatus.bind(ordersController));
}