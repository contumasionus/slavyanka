import { FastifyInstance } from 'fastify';
import prisma from '../db';
import { ReviewsController } from '../controllers/reviews.controller';
import { ReviewsService } from '../services/reviews.service';
import { verifyJWT, verifyAdmin } from '../middleware/auth';

export async function reviewsRoutes(server: FastifyInstance) {
  const reviewsService = new ReviewsService(prisma);
  const reviewsController = new ReviewsController(reviewsService);

  server.get('/product/:productId', async (req, reply) => reviewsController.getByProduct(req, reply));
  server.post('/', { preHandler: verifyJWT }, async (req, reply) => reviewsController.create(req, reply));
  server.delete('/:id', { preHandler: verifyAdmin }, async (req, reply) => reviewsController.delete(req, reply));
}