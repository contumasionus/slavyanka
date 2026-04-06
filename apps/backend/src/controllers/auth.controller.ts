import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../services/auth.service';

export class AuthController {
  constructor(private authService: AuthService) {}

  async login(request: FastifyRequest<{ Body: { email: string; password: string } }>, reply: FastifyReply) {
    try {
      const user = await this.authService.login(request.body.email, request.body.password);
      const token = request.server.jwt.sign({ id: user.id, email: user.email, role: user.role });
      reply.send({ token, user });
    } catch (error) {
      reply.status(401).send({ error: (error as Error).message });
    }
  }

  async register(request: FastifyRequest<{ Body: { email: string; password: string; name: string } }>, reply: FastifyReply) {
    try {
      const user = await this.authService.register(request.body);
      const token = request.server.jwt.sign({ id: user.id, email: user.email, role: user.role });
      reply.status(201).send({ token, user });
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  }

  async getMe(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = request.user as { id: string };
      const userData = await this.authService.getUserById(user.id);
      reply.send(userData);
    } catch (error) {
      reply.status(404).send({ error: (error as Error).message });
    }
  }
}