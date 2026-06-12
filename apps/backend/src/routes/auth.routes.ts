import { FastifyInstance } from 'fastify';
import prisma from '../db';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { VerificationService } from '../services/verification.service';
import { verifyJWT } from '../middleware/auth';

export async function authRoutes(server: FastifyInstance) {
  const authService = new AuthService(prisma);
  const verificationService = new VerificationService(prisma);
  const authController = new AuthController(authService, verificationService);

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

  server.post('/send-verification', {
    schema: {
      body: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { type: 'string', format: 'email' },
        },
      },
    },
  }, authController.sendVerificationCode.bind(authController));

  server.post('/verify-code', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'code'],
        properties: {
          email: { type: 'string', format: 'email' },
          code: { type: 'string', minLength: 6, maxLength: 6 },
        },
      },
    },
  }, authController.verifyCode.bind(authController));

  server.get('/me', {
    preHandler: verifyJWT,
  }, authController.getMe.bind(authController));
}