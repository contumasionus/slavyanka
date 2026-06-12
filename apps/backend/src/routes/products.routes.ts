import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import prisma from '../db';
import { ProductsController } from '../controllers/products.controller';
import { ProductsService } from '../services/products.service';
import { verifyAdmin, verifyJWT } from '../middleware/auth';

export async function productsRoutes(server: FastifyInstance) {
  const productsService = new ProductsService(prisma);
  const productsController = new ProductsController(productsService);

  server.get('/', async (req, reply) => productsController.getAll(req, reply));
  server.get('/promo', async (req, reply) => productsController.getPromo(req, reply));
  server.get('/search', async (req, reply) => productsController.search(req, reply));
  server.get('/:id', async (req, reply) => productsController.getById(req, reply));
  server.get('/category/:slug', async (req, reply) => productsController.getByCategory(req, reply));

  server.get('/viewed/history', { preHandler: verifyJWT }, async (req, reply) => productsController.getViewed(req, reply));
  server.post('/viewed/record', { preHandler: verifyJWT }, async (req, reply) => productsController.recordView(req, reply));

  server.post('/', { preHandler: verifyAdmin }, async (req, reply) => productsController.create(req, reply));
  server.put('/:id', { preHandler: verifyAdmin }, async (req, reply) => productsController.update(req, reply));
  server.delete('/:id', { preHandler: verifyAdmin }, async (req, reply) => productsController.delete(req, reply));
}