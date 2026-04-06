import { FastifyInstance } from 'fastify';
import { ProductsController } from '../controllers/products.controller';
import { ProductsService } from '../services/products.service';
import { verifyAdmin } from '../middleware/auth';

export async function productsRoutes(server: FastifyInstance) {
  const productsService = new ProductsService(server.prisma);
  const productsController = new ProductsController(productsService);

  server.get('/', productsController.getAll.bind(productsController));
  server.get('/:id', productsController.getById.bind(productsController));
  server.get('/category/:slug', productsController.getByCategory.bind(productsController));

  server.post('/', {
    preHandler: verifyAdmin,
    schema: {
      body: {
        type: 'object',
        required: ['name', 'price', 'categoryId'],
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number', minimum: 0 },
          weight: { type: 'string' },
          imageUrl: { type: 'string' },
          categoryId: { type: 'string' },
          inStock: { type: 'boolean' },
          deliveryDate: { type: 'string' },
        },
      },
    },
  }, async (request: any, reply: any) => {
    await productsController.create(request, reply);
  });

  server.put('/:id', {
    preHandler: verifyAdmin,
    schema: {
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number', minimum: 0 },
          weight: { type: 'string' },
          imageUrl: { type: 'string' },
          categoryId: { type: 'string' },
          inStock: { type: 'boolean' },
          deliveryDate: { type: 'string' },
        },
      },
    },
  }, async (request: any, reply: any) => {
    await productsController.update(request, reply);
  });

  server.delete('/:id', {
    preHandler: verifyAdmin,
  }, async (request: any, reply: any) => {
    await productsController.delete(request, reply);
  });
}