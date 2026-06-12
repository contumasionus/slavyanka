import { PrismaClient } from '@prisma/client';

export class NewsService {
  constructor(private prisma: PrismaClient) {}

  async findAll(publishedOnly = false) {
    const where = publishedOnly ? { published: true } : {};
    return this.prisma.news.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.news.findUnique({ where: { slug } });
  }

  async findById(id: string) {
    return this.prisma.news.findUnique({ where: { id } });
  }

  async create(data: {
    title: string;
    slug: string;
    content: string;
    imageUrl?: string;
    excerpt?: string;
    tags?: string;
    published?: boolean;
  }) {
    return this.prisma.news.create({
      data: {
        title: data.title.trim(),
        slug: data.slug.trim(),
        content: data.content,
        imageUrl: data.imageUrl || null,
        excerpt: data.excerpt?.trim() || null,
        tags: data.tags || null,
        published: data.published ?? false,
      },
    });
  }

  async update(id: string, data: Partial<{
    title: string;
    slug: string;
    content: string;
    imageUrl?: string;
    excerpt?: string;
    tags?: string;
    published?: boolean;
  }>) {
    const cleanData: any = {};
    if (data.title !== undefined) cleanData.title = data.title.trim();
    if (data.slug !== undefined) cleanData.slug = data.slug.trim();
    if (data.content !== undefined) cleanData.content = data.content;
    if (data.imageUrl !== undefined) cleanData.imageUrl = data.imageUrl || null;
    if (data.excerpt !== undefined) cleanData.excerpt = data.excerpt?.trim() || null;
    if (data.tags !== undefined) cleanData.tags = data.tags || null;
    if (data.published !== undefined) cleanData.published = Boolean(data.published);

    return this.prisma.news.update({ where: { id }, data: cleanData });
  }

  async delete(id: string) {
    return this.prisma.news.delete({ where: { id } });
  }
}