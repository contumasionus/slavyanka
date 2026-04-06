export enum OrderStatus {
  NEW = 'new',
  PROCESSING = 'processing',
  READY = 'ready',
  COMPLETED = 'completed'
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: import('./product.types').Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  user?: import('./user.types').User;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
}