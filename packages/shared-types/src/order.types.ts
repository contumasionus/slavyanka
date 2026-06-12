export enum OrderStatus {
  NEW = 'new',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  DELIVERING = 'delivering',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  RECEIVED = 'received',
  DELIVERY_ISSUE = 'delivery_issue',
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
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  comment: string;
  deliveryType: 'pickup' | 'delivery';
  deliveryTime?: string;
  deliveryAddress?: string;
  paymentMethod: string;
  cardLast4: string;
  paid: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderDto {
  items: { productId: string; quantity: number; price: number }[];
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  comment?: string;
  deliveryType: 'pickup' | 'delivery';
  deliveryTime?: string;
  deliveryAddress?: string;
  paymentMethod?: string;
  cardLast4?: string;
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
}