import { FastifyInstance } from 'fastify';
import prisma from '../db';
import { OrdersController } from '../controllers/orders.controller';
import { OrdersService } from '../services/orders.service';
import { verifyAdmin, verifyJWT } from '../middleware/auth';

export async function ordersRoutes(server: FastifyInstance) {
  const ordersService = new OrdersService(prisma);
  const ordersController = new OrdersController(ordersService);

  server.get('/my', { preHandler: verifyJWT }, async (req, reply) => ordersController.getMyOrders(req, reply));
  server.post('/', { preHandler: verifyJWT }, async (req, reply) => ordersController.create(req, reply));

  server.patch('/:id/received', { preHandler: verifyJWT }, async (req, reply) => ordersController.markReceived(req, reply));
  server.patch('/:id/not-delivered', { preHandler: verifyJWT }, async (req, reply) => ordersController.markNotDelivered(req, reply));

  server.get('/', { preHandler: verifyAdmin }, async (req, reply) => ordersController.getAll(req, reply));
  server.get('/:id', { preHandler: verifyAdmin }, async (req, reply) => ordersController.getById(req, reply));
  server.patch('/:id/status', { preHandler: verifyAdmin }, async (req, reply) => ordersController.updateStatus(req, reply));
  server.delete('/:id', { preHandler: verifyAdmin }, async (req, reply) => ordersController.delete(req, reply));
}