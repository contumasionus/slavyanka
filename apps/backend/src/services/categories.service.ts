import { PrismaClient } from '@prisma/client';

export class CategoriesService {
  constructor(private prisma: PrismaClient) {}

  async findAll() {
    return this.prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.category.findUnique({
      where: { slug },
      include: { products: true },
    });
  }

  async create(data: { name: string; slug: string; description?: string; imageUrl?: string }) {
    return this.prisma.category.create({ data });
  }

  async update(id: string, data: Partial<{ name: string; slug: string; description?: string; imageUrl?: string }>) {
    return this.prisma.category.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.category.delete({ where: { id } });
  }
}