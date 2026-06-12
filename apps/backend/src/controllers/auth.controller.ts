import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../services/auth.service';
import { VerificationService } from '../services/verification.service';

export class AuthController {
  private verificationService: VerificationService;

  constructor(
    private authService: AuthService,
    verificationService?: VerificationService,
  ) {
    this.verificationService = verificationService || new VerificationService(
      (authService as any).prisma,
    );
  }

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

  async sendVerificationCode(request: FastifyRequest<{ Body: { email: string } }>, reply: FastifyReply) {
    try {
      const { email } = request.body;

      // Проверяем, не занят ли email
      const existingUser = await (this.authService as any).prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        reply.status(400).send({ error: 'Email уже зарегистрирован' });
        return;
      }

      await this.verificationService.sendCode(email);
      reply.send({ success: true, message: 'Код отправлен на email' });
    } catch (error) {
      reply.status(500).send({ error: 'Ошибка отправки кода' });
    }
  }

  async verifyCode(request: FastifyRequest<{ Body: { email: string; code: string } }>, reply: FastifyReply) {
    try {
      const { email, code } = request.body;
      const isValid = await this.verificationService.verifyCode(email, code);

      if (!isValid) {
        reply.status(400).send({ error: 'Неверный или истёкший код' });
        return;
      }

      reply.send({ success: true });
    } catch (error) {
      reply.status(500).send({ error: 'Ошибка проверки кода' });
    }
  }
}