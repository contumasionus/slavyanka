import { PrismaClient } from '@prisma/client';

export class NotificationsService {
  constructor(private prisma: PrismaClient) {}

  async subscribe(userId: string, productId: string) {
    const existing = await this.prisma.productNotification.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existing) {
      throw new Error('Already subscribed to this product');
    }

    return this.prisma.productNotification.create({
      data: {
        userId,
        productId,
      },
      include: {
        product: true,
      },
    });
  }

  async unsubscribe(userId: string, productId: string) {
    const notification = await this.prisma.productNotification.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    return this.prisma.productNotification.delete({
      where: {
        id: notification.id,
      },
    });
  }

  async getUserNotifications(userId: string) {
    return this.prisma.productNotification.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async isSubscribed(userId: string, productId: string): Promise<boolean> {
    const notification = await this.prisma.productNotification.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
    return !!notification;
  }

  async getProductSubscribers(productId: string) {
    return this.prisma.productNotification.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async getNotificationStats(userId: string) {
    const notifications = await this.prisma.productNotification.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });

    const productCounts: Record<string, { name: string; count: number }> = {};
    
    notifications.forEach((n) => {
      if (n.product) {
        if (!productCounts[n.productId]) {
          productCounts[n.productId] = { name: n.product.name, count: 0 };
        }
        productCounts[n.productId].count++;
      }
    });

    const topProducts = Object.entries(productCounts)
      .map(([productId, data]) => ({
        productId,
        productName: data.name,
        notificationCount: data.count,
      }))
      .sort((a, b) => b.notificationCount - a.notificationCount)
      .slice(0, 5);

    return {
      totalNotifications: notifications.length,
      topProducts,
    };
  }
}