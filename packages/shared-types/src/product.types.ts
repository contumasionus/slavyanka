export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  weight?: string;
  imageUrl?: string;
  categoryId: string;
  category?: import('./category.types').Category;
  inStock: boolean;
  deliveryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  weight?: string;
  imageUrl?: string;
  categoryId: string;
  inStock?: boolean;
  deliveryDate?: Date;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}
