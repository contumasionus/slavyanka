export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryDto {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}