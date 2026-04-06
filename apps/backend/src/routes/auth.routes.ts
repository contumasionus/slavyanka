import { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { verifyJWT } from '../middleware/auth';

export async function authRoutes(server: FastifyInstance) {
  const authService = new AuthService(server.prisma);
  const authController = new AuthController(authService);

  server.post('/login', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
        },
      },
    },
  }, authController.login.bind(authController));

  server.post('/register', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password', 'name'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
          name: { type: 'string', minLength: 2 },
        },
      },
    },
  }, authController.register.bind(authController));

  server.get('/me', {
    preHandler: verifyJWT,
  }, authController.getMe.bind(authController));
}