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
  composition?: string;
  manufacturer?: string;
  country?: string;
  shelfLife?: string;
  calories?: number;
  proteins?: number;
  fats?: number;
  carbohydrates?: number;
  // Скидки и акции
  discountPrice?: number;
  discountUntil?: string;
  isPromo: boolean;
  // Рейтинг
  avgRating: number;
  reviewCount: number;
  deliveryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  weight?: string;
  imageUrl?: string;
  categoryId: string;
  inStock?: boolean;
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
  deliveryDate?: string;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  text?: string;
  photo?: string;
  user?: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewDto {
  productId: string;
  rating: number;
  text?: string;
  photo?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  imageUrl?: string;
  excerpt?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNewsDto {
  title: string;
  slug: string;
  content: string;
  imageUrl?: string;
  excerpt?: string;
  published?: boolean;
}

export interface UpdateNewsDto extends Partial<CreateNewsDto> {}