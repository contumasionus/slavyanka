import { PrismaClient } from '@prisma/client';

export class OrdersService {
  constructor(private prisma: PrismaClient) {}

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { include: { product: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { include: { product: true } },
      },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { include: { product: true } },
      },
    });
  }
}