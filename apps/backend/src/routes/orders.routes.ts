import { FastifyInstance } from 'fastify';
import { OrdersController } from '../controllers/orders.controller';
import { OrdersService } from '../services/orders.service';
import { verifyAdmin } from '../middleware/auth';

export async function ordersRoutes(server: FastifyInstance) {
  const ordersService = new OrdersService(server.prisma);
  const ordersController = new OrdersController(ordersService);

  server.get('/', {
    preHandler: verifyAdmin,
  }, async (request: any, reply: any) => {
    await ordersController.getAll(request, reply);
  });

  server.get('/:id', {
    preHandler: verifyAdmin,
  }, async (request: any, reply: any) => {
    await ordersController.getById(request, reply);
  });

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
  }, async (request: any, reply: any) => {
    await ordersController.updateStatus(request, reply);
  });
}