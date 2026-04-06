import { FastifyInstance } from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

export async function swaggerPlugin(server: FastifyInstance) {
  await server.register(swagger, {
    swagger: {
      info: {
        title: 'Славянка API',
        description: 'API для продуктового магазина Славянка',
        version: '1.0.0',
      },
      host: 'localhost:3001',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      securityDefinitions: {
        bearerAuth: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
        },
      },
    },
  });

  await server.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
  });
}