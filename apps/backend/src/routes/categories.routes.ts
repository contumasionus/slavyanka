import { FastifyInstance } from 'fastify';
import { CategoriesController } from '../controllers/categories.controller';
import { CategoriesService } from '../services/categories.service';
import { verifyAdmin } from '../middleware/auth';

export async function categoriesRoutes(server: FastifyInstance) {
  const categoriesService = new CategoriesService(server.prisma);
  const categoriesController = new CategoriesController(categoriesService);

  server.get('/', categoriesController.getAll.bind(categoriesController));
  server.get('/:slug', categoriesController.getBySlug.bind(categoriesController));

  server.post('/', {
    preHandler: verifyAdmin,
    schema: {
      body: {
        type: 'object',
        required: ['name', 'slug'],
        properties: {
          name: { type: 'string' },
          slug: { type: 'string' },
          description: { type: 'string' },
          imageUrl: { type: 'string' },
        },
      },
    },
  }, categoriesController.create.bind(categoriesController));

  server.put('/:id', {
    preHandler: verifyAdmin,
    schema: {
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          slug: { type: 'string' },
          description: { type: 'string' },
          imageUrl: { type: 'string' },
        },
      },
    },
  }, categoriesController.update.bind(categoriesController));

  server.delete('/:id', {
    preHandler: verifyAdmin,
  }, categoriesController.delete.bind(categoriesController));
}