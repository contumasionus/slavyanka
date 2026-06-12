import { PrismaClient } from '@prisma/client';

export class ContactMessagesService {
  constructor(private prisma: PrismaClient) {}

  // Создать отзыв (публичный)
  async create(data: { name: string; email: string; phone?: string; topic?: string; message: string }) {
    return this.prisma.contactMessage.create({ data });
  }

  // Получить все отзывы (админ)
  async getAll() {
    return this.prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // Получить один отзыв
  async getById(id: string) {
    return this.prisma.contactMessage.findUnique({ where: { id } });
  }

  // Ответить на отзыв (админ)
  async reply(id: string, adminReply: string) {
    return this.prisma.contactMessage.update({
      where: { id },
      data: { adminReply, repliedAt: new Date(), isRead: true },
    });
  }

  // Удалить отзыв
  async delete(id: string) {
    return this.prisma.contactMessage.delete({ where: { id } });
  }
}