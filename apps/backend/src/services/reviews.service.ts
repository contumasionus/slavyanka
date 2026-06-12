import { PrismaClient } from '@prisma/client';

export class ReviewsService {
  constructor(private prisma: PrismaClient) {}

  async findByProduct(productId: string) {
    return this.prisma.review.findMany({
      where: { productId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: { userId: string; productId: string; rating: number; text?: string; photo?: string }) {
    if (data.rating < 1 || data.rating > 5) throw new Error('Rating must be between 1 and 5');

    // Upsert: если отзыв уже есть — обновляем
    const review = await this.prisma.review.upsert({
      where: {
        userId_productId: { userId: data.userId, productId: data.productId },
      },
      create: {
        userId: data.userId,
        productId: data.productId,
        rating: data.rating,
        text: data.text || null,
        photo: data.photo || null,
      },
      update: {
        rating: data.rating,
        text: data.text || null,
        photo: data.photo || null,
      },
    });

    // Пересчитываем рейтинг товара
    await this.recalculateRating(data.productId);

    return review;
  }

  async delete(id: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new Error('Review not found');
    await this.prisma.review.delete({ where: { id } });
    await this.recalculateRating(review.productId);
  }

  private async recalculateRating(productId: string) {
    const stats = await this.prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: true,
    });
    await this.prisma.product.update({
      where: { id: productId },
      data: {
        avgRating: stats._avg.rating || 0,
        reviewCount: stats._count,
      },
    });
  }
}