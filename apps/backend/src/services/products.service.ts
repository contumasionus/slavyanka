import { PrismaClient } from '@prisma/client';

export class ProductsService {
  constructor(private prisma: PrismaClient) {}

  async findAll() {
    return this.prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: { category: true, reviews: { include: { user: { select: { id: true, name: true } } }, orderBy: { createdAt: 'desc' } } },
    });
  }

  async findByCategory(slug: string) {
    return this.prisma.product.findMany({
      where: { category: { slug } },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPromo() {
    return this.prisma.product.findMany({
      where: {
        OR: [
          { isPromo: true },
          { discountPrice: { not: null } },
        ],
      },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async search(query: string) {
    // SQLite не поддерживает mode: 'insensitive', поэтому фильтруем через JS
    const q = query.toLowerCase();
    const products = await this.prisma.product.findMany({
      include: { category: true },
      take: 50,
      orderBy: { createdAt: 'desc' },
    });
    return products.filter(p => p.name.toLowerCase().includes(q)).slice(0, 10);
  }

  async getViewed(userId: string) {
    const views = await this.prisma.viewedProduct.findMany({
      where: { userId },
      include: { product: { include: { category: true } } },
      orderBy: { viewedAt: 'desc' },
      take: 12,
      distinct: ['productId'],
    });
    return views.map(v => v.product);
  }

  async recordView(userId: string, productId: string) {
    await this.prisma.viewedProduct.create({
      data: { userId, productId },
    });
  }

  async create(data: {
    name: string;
    description?: string;
    price: number;
    weight?: string;
    imageUrl?: string;
    categoryId: string;
    inStock?: boolean;
    deliveryDate?: string;
    composition?: string;
    manufacturer?: string;
    country?: string;
    shelfLife?: string;
    calories?: number;
    proteins?: number;
    fats?: number;
    carbohydrates?: number;
    discountPrice?: number;
    discountUntil?: string;
    isPromo?: boolean;
  }) {
    const cleanData: any = {
      name: data.name.trim(),
      price: Number(data.price),
      categoryId: data.categoryId,
      inStock: data.inStock ?? true,
    };

    if (isNaN(cleanData.price) || cleanData.price < 0) {
      throw new Error('Invalid price value');
    }

    if (data.description !== undefined) cleanData.description = data.description?.trim() || null;
    if (data.weight !== undefined) cleanData.weight = data.weight?.trim() || null;
    if (data.imageUrl !== undefined) cleanData.imageUrl = data.imageUrl || null;
    if (data.composition !== undefined) cleanData.composition = data.composition?.trim() || null;
    if (data.manufacturer !== undefined) cleanData.manufacturer = data.manufacturer?.trim() || null;
    if (data.country !== undefined) cleanData.country = data.country?.trim() || null;
    if (data.shelfLife !== undefined) cleanData.shelfLife = data.shelfLife?.trim() || null;

    if (data.calories !== undefined) {
      cleanData.calories = data.calories != null ? Number(data.calories) : null;
      if (cleanData.calories !== null && (isNaN(cleanData.calories) || cleanData.calories < 0)) cleanData.calories = null;
    }
    if (data.proteins !== undefined) {
      cleanData.proteins = data.proteins != null ? Number(data.proteins) : null;
      if (cleanData.proteins !== null && isNaN(cleanData.proteins)) cleanData.proteins = null;
    }
    if (data.fats !== undefined) {
      cleanData.fats = data.fats != null ? Number(data.fats) : null;
      if (cleanData.fats !== null && isNaN(cleanData.fats)) cleanData.fats = null;
    }
    if (data.carbohydrates !== undefined) {
      cleanData.carbohydrates = data.carbohydrates != null ? Number(data.carbohydrates) : null;
      if (cleanData.carbohydrates !== null && isNaN(cleanData.carbohydrates)) cleanData.carbohydrates = null;
    }

    // Скидки
    if (data.discountPrice !== undefined) {
      cleanData.discountPrice = data.discountPrice != null ? Number(data.discountPrice) : null;
    }
    if (data.discountUntil !== undefined) {
      if (data.discountUntil && data.discountUntil.trim() !== '') {
        const date = new Date(data.discountUntil);
        if (isNaN(date.getTime())) throw new Error('Invalid discountUntil format');
        cleanData.discountUntil = date;
      } else {
        cleanData.discountUntil = null;
      }
    }
    if (data.isPromo !== undefined) cleanData.isPromo = Boolean(data.isPromo);

    if (cleanData.inStock === true) {
      cleanData.deliveryDate = null;
    } else if (data.deliveryDate !== undefined) {
      if (data.deliveryDate && data.deliveryDate.trim() !== '') {
        const date = new Date(data.deliveryDate);
        if (isNaN(date.getTime())) throw new Error('Invalid deliveryDate format');
        cleanData.deliveryDate = date;
      } else {
        cleanData.deliveryDate = null;
      }
    }

    return this.prisma.product.create({
      data: cleanData,
      include: { category: true },
    });
  }

  async update(id: string, data: Partial<{
    name: string;
    description?: string;
    price: number;
    weight?: string;
    imageUrl?: string;
    categoryId: string;
    inStock?: boolean;
    deliveryDate?: string;
    composition?: string;
    manufacturer?: string;
    country?: string;
    shelfLife?: string;
    calories?: number;
    proteins?: number;
    fats?: number;
    carbohydrates?: number;
    discountPrice?: number;
    discountUntil?: string;
    isPromo?: boolean;
  }>) {
    const cleanData: any = {};

    if (data.name !== undefined) cleanData.name = data.name.trim();
    if (data.description !== undefined) cleanData.description = data.description?.trim() || null;
    if (data.price !== undefined) {
      cleanData.price = Number(data.price);
      if (isNaN(cleanData.price) || cleanData.price < 0) throw new Error('Invalid price value');
    }
    if (data.weight !== undefined) cleanData.weight = data.weight?.trim() || null;
    if (data.imageUrl !== undefined) cleanData.imageUrl = data.imageUrl || null;
    if (data.categoryId !== undefined) cleanData.categoryId = data.categoryId;
    if (data.inStock !== undefined) cleanData.inStock = Boolean(data.inStock);
    if (data.composition !== undefined) cleanData.composition = data.composition?.trim() || null;
    if (data.manufacturer !== undefined) cleanData.manufacturer = data.manufacturer?.trim() || null;
    if (data.country !== undefined) cleanData.country = data.country?.trim() || null;
    if (data.shelfLife !== undefined) cleanData.shelfLife = data.shelfLife?.trim() || null;

    if (data.calories !== undefined) {
      cleanData.calories = data.calories != null ? Number(data.calories) : null;
      if (cleanData.calories !== null && (isNaN(cleanData.calories) || cleanData.calories < 0)) cleanData.calories = null;
    }
    if (data.proteins !== undefined) {
      cleanData.proteins = data.proteins != null ? Number(data.proteins) : null;
      if (cleanData.proteins !== null && isNaN(cleanData.proteins)) cleanData.proteins = null;
    }
    if (data.fats !== undefined) {
      cleanData.fats = data.fats != null ? Number(data.fats) : null;
      if (cleanData.fats !== null && isNaN(cleanData.fats)) cleanData.fats = null;
    }
    if (data.carbohydrates !== undefined) {
      cleanData.carbohydrates = data.carbohydrates != null ? Number(data.carbohydrates) : null;
      if (cleanData.carbohydrates !== null && isNaN(cleanData.carbohydrates)) cleanData.carbohydrates = null;
    }

    // Скидки
    if (data.discountPrice !== undefined) {
      cleanData.discountPrice = data.discountPrice != null ? Number(data.discountPrice) : null;
    }
    if (data.discountUntil !== undefined) {
      if (data.discountUntil && data.discountUntil.trim() !== '') {
        const date = new Date(data.discountUntil);
        if (isNaN(date.getTime())) throw new Error('Invalid discountUntil format');
        cleanData.discountUntil = date;
      } else {
        cleanData.discountUntil = null;
      }
    }
    if (data.isPromo !== undefined) cleanData.isPromo = Boolean(data.isPromo);

    if (cleanData.inStock === true) {
      cleanData.deliveryDate = null;
    } else if (data.deliveryDate !== undefined) {
      if (data.deliveryDate && data.deliveryDate.trim() !== '') {
        const date = new Date(data.deliveryDate);
        if (isNaN(date.getTime())) throw new Error('Invalid deliveryDate format');
        cleanData.deliveryDate = date;
      } else {
        cleanData.deliveryDate = null;
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: cleanData,
      include: { category: true },
    });
  }

  async delete(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }
}