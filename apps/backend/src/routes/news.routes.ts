import { FastifyInstance } from 'fastify';
import prisma from '../db';
import { NewsController } from '../controllers/news.controller';
import { NewsService } from '../services/news.service';
import { verifyAdmin } from '../middleware/auth';

export async function newsRoutes(server: FastifyInstance) {
  const newsService = new NewsService(prisma);
  const newsController = new NewsController(newsService);

  server.get('/', async (req, reply) => newsController.getAll(req, reply));
  server.get('/:slug', async (req, reply) => newsController.getBySlug(req, reply));

  server.get('/admin/all', { preHandler: verifyAdmin }, async (req, reply) => newsController.getAllAdmin(req, reply));
  server.get('/admin/:id', { preHandler: verifyAdmin }, async (req, reply) => newsController.getById(req, reply));
  server.post('/', { preHandler: verifyAdmin }, async (req, reply) => newsController.create(req, reply));
  server.put('/:id', { preHandler: verifyAdmin }, async (req, reply) => newsController.update(req, reply));
  server.delete('/:id', { preHandler: verifyAdmin }, async (req, reply) => newsController.delete(req, reply));
}