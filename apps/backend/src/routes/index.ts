import { FastifyInstance } from 'fastify';
import { authRoutes } from './auth.routes';
import { productsRoutes } from './products.routes';
import { categoriesRoutes } from './categories.routes';
import { ordersRoutes } from './orders.routes';
import { usersRoutes } from './users.routes';
import { notificationsRoutes } from './notifications.routes';
import { visitsRoutes } from './visits.routes';

export async function registerRoutes(server: FastifyInstance) {
  server.register(authRoutes, { prefix: '/api/auth' });
  server.register(productsRoutes, { prefix: '/api/products' });
  server.register(categoriesRoutes, { prefix: '/api/categories' });
  server.register(ordersRoutes, { prefix: '/api/orders' });
  server.register(usersRoutes, { prefix: '/api/users' });
  server.register(notificationsRoutes, { prefix: '/api/notifications' });
  server.register(visitsRoutes, { prefix: '/api/visits' });
}
