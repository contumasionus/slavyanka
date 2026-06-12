import { PrismaClient } from '@prisma/client';

export class ChatService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Создать новую сессию чата
   */
  async createSession(data: { userId?: string; guestId: string; userName?: string }) {
    return this.prisma.chatSession.create({
      data: {
        userId: data.userId || null,
        guestId: data.guestId,
        userName: data.userName || null,
        status: 'active',
      },
      include: { messages: true },
    });
  }

  /**
   * Получить все активные сессии (для админа)
   */
  async getActiveSessions() {
    return this.prisma.chatSession.findMany({
      where: { status: 'active' },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  /**
   * Получить все сессии (для админа)
   */
  async getAllSessions() {
    return this.prisma.chatSession.findMany({
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  /**
   * Получить сессию по ID
   */
  async getSessionById(sessionId: string) {
    return this.prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  /**
   * Получить сообщения сессии
   */
  async getSessionMessages(sessionId: string) {
    return this.prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Отправить сообщение
   */
  async sendMessage(data: {
    sessionId: string;
    senderType: 'user' | 'admin';
    content: string;
    attachment?: string;
  }) {
    const message = await this.prisma.chatMessage.create({
      data: {
        sessionId: data.sessionId,
        senderType: data.senderType,
        content: data.content,
        attachment: data.attachment || null,
      },
    });

    // Обновляем updatedAt сессии
    await this.prisma.chatSession.update({
      where: { id: data.sessionId },
      data: { updatedAt: new Date() },
    });

    return message;
  }

  /**
   * Отметить сообщение как прочитанное
   */
  async markAsRead(messageId: string) {
    return this.prisma.chatMessage.update({
      where: { id: messageId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  /**
   * Отметить все сообщения сессии как прочитанные
   */
  async markAllAsRead(sessionId: string, senderType: string) {
    return this.prisma.chatMessage.updateMany({
      where: {
        sessionId,
        senderType,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  /**
   * Закрыть сессию
   */
  async closeSession(sessionId: string) {
    return this.prisma.chatSession.update({
      where: { id: sessionId },
      data: { status: 'closed' },
    });
  }

  /**
   * Получить сессию чата по userId
   */
  async findSessionByUserId(userId: string) {
    return this.prisma.chatSession.findFirst({
      where: { userId, status: 'active' },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  /**
   * Получить количество непрочитанных сообщений (для админа)
   */
  async getUnreadCount() {
    const result = await this.prisma.chatMessage.count({
      where: {
        senderType: 'user',
        isRead: false,
        session: { status: 'active' },
      },
    });
    return result;
  }
}
