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
      include: { category: true },
    });
  }

  async findByCategory(slug: string) {
    return this.prisma.product.findMany({
      where: { category: { slug } },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
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
  }) {
    // Валидация и очистка данных перед созданием
    const cleanData: any = {
      name: data.name.trim(),
      price: Number(data.price),
      categoryId: data.categoryId,
      inStock: data.inStock ?? true,
    };
    
    if (isNaN(cleanData.price) || cleanData.price < 0) {
      throw new Error('Invalid price value');
    }
    
    if (data.description !== undefined) {
      cleanData.description = data.description?.trim() || null;
    }
    
    if (data.weight !== undefined) {
      cleanData.weight = data.weight?.trim() || null;
    }
    
    if (data.imageUrl !== undefined) {
      cleanData.imageUrl = data.imageUrl || null;
    }
    
    if (data.deliveryDate !== undefined) {
      if (data.deliveryDate && data.deliveryDate.trim() !== '') {
        const date = new Date(data.deliveryDate);
        if (isNaN(date.getTime())) {
          throw new Error('Invalid deliveryDate format');
        }
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
  }>) {
    // Валидация и очистка данных перед обновлением
    const cleanData: any = {};
    
    if (data.name !== undefined) {
      cleanData.name = data.name.trim();
    }
    
    if (data.description !== undefined) {
      cleanData.description = data.description?.trim() || null;
    }
    
    if (data.price !== undefined) {
      cleanData.price = Number(data.price);
      if (isNaN(cleanData.price) || cleanData.price < 0) {
        throw new Error('Invalid price value');
      }
    }
    
    if (data.weight !== undefined) {
      cleanData.weight = data.weight?.trim() || null;
    }
    
    if (data.imageUrl !== undefined) {
      cleanData.imageUrl = data.imageUrl || null;
    }
    
    if (data.categoryId !== undefined) {
      cleanData.categoryId = data.categoryId;
    }
    
    if (data.inStock !== undefined) {
      cleanData.inStock = Boolean(data.inStock);
    }
    
    if (data.deliveryDate !== undefined) {
      if (data.deliveryDate && data.deliveryDate.trim() !== '') {
        const date = new Date(data.deliveryDate);
        if (isNaN(date.getTime())) {
          throw new Error('Invalid deliveryDate format');
        }
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