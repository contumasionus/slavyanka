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

  async findByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: { include: { product: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findUserOrder(orderId: string, userId: string) {
    return this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { include: { product: true } },
      },
    });
  }

  async create(data: {
    userId: string;
    items: { productId: string; quantity: number; price: number }[];
    totalAmount: number;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    comment?: string;
    deliveryType: 'pickup' | 'delivery';
    deliveryTime?: string;
    deliveryAddress?: string;
    paymentMethod?: string;
    cardLast4?: string;
  }) {
    return this.prisma.order.create({
      data: {
        userId: data.userId,
        status: 'new',
        totalAmount: data.totalAmount,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerAddress: data.customerAddress,
        comment: data.comment || '',
        deliveryType: data.deliveryType,
        deliveryTime: data.deliveryTime || null,
        deliveryAddress: data.deliveryAddress || null,
        paymentMethod: data.paymentMethod || '',
        cardLast4: data.cardLast4 || '',
        paid: data.paymentMethod ? true : false,
        items: {
          create: data.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
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

  async delete(id: string) {
    return this.prisma.order.delete({ where: { id } });
  }
}