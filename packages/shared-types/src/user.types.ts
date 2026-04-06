export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer'
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateUserDto = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateUserDto = Partial<CreateUserDto>;
export type UserWithoutPassword = Omit<User, 'password'>;

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  visitCount: number;
  notificationCount: number;
}

export interface ProductNotification {
  id: string;
  userId: string;
  productId: string;
  createdAt: Date;
  product?: import('./product.types').Product;
}

export interface UserVisit {
  id: string;
  userId: string;
  visitedAt: Date;
}

export interface UserNotificationStats {
  totalNotifications: number;
  topProducts: {
    productId: string;
    productName: string;
    notificationCount: number;
  }[];
}
