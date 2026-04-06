import Fastify from 'fastify';
import { corsPlugin } from './plugins/cors';
import { jwtPlugin } from './plugins/jwt';
import { prismaPlugin } from './plugins/prisma';
import { swaggerPlugin } from './plugins/swagger';
import { registerRoutes } from './routes';

const server = Fastify({
  logger: true,
});

async function start() {
  // Register plugins
  await corsPlugin(server);
  await jwtPlugin(server);
  await prismaPlugin(server);
  await swaggerPlugin(server);

  // Register routes
  await registerRoutes(server);

  // Start server
  try {
    await server.listen({ port: 3001, host: '0.0.0.0' });
    console.log('Server running on http://localhost:3001');
    console.log('Swagger docs available at http://localhost:3001/docs');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();