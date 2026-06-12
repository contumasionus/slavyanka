import { PrismaClient } from '@prisma/client';
import { FastifyRequest } from 'fastify';

export class AuditService {
  constructor(private prisma: PrismaClient) {}

  async log(
    request: FastifyRequest,
    action: string,
    entity?: string,
    entityId?: string,
    details?: string
  ) {
    try {
      const userId = (request.user as { id?: string })?.id;
      const ipAddress = request.ip;
      const userAgent = request.headers['user-agent'];

      await this.prisma.auditLog.create({
        data: {
          userId,
          action,
          entity,
          entityId,
          details,
          ipAddress,
          userAgent,
        },
      });
    } catch (error) {
      // Не падать если логирование сломалось
      console.error('Failed to write audit log:', error);
    }
  }

  async getLogs(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.auditLog.count(),
    ]);

    return {
      logs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUserLogs(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    return this.prisma.auditLog.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }
}