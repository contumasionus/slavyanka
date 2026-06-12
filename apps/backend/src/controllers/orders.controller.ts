import { FastifyRequest, FastifyReply } from 'fastify';
import { OrdersService } from '../services/orders.service';

export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  async getAll(request: FastifyRequest, reply: FastifyReply) {
    const orders = await this.ordersService.findAll();
    reply.send(orders);
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { id: string };
    const order = await this.ordersService.findById(params.id);
    if (!order) {
      reply.status(404).send({ error: 'Order not found' });
      return;
    }
    reply.send(order);
  }

  async getMyOrders(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as { id: string };
    const orders = await this.ordersService.findByUser(user.id);
    reply.send(orders);
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as { id: string };
    try {
      const body = request.body as any;
      const order = await this.ordersService.create({
        userId: user.id,
        items: body.items,
        totalAmount: body.totalAmount,
        customerName: body.customerName,
        customerPhone: body.customerPhone,
        customerAddress: body.customerAddress,
        comment: body.comment,
        deliveryType: body.deliveryType || 'pickup',
        deliveryTime: body.deliveryTime,
        deliveryAddress: body.deliveryAddress,
        paymentMethod: body.paymentMethod,
        cardLast4: body.cardLast4,
      });
      reply.status(201).send(order);
    } catch (error: any) {
      reply.status(400).send({ error: error.message || 'Failed to create order' });
    }
  }

  async updateStatus(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { id: string };
    const body = request.body as { status: string };
    const order = await this.ordersService.updateStatus(params.id, body.status);
    reply.send(order);
  }

  async markReceived(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as { id: string };
    const params = request.params as { id: string };
    const order = await this.ordersService.findUserOrder(params.id, user.id);
    if (!order) {
      reply.status(403).send({ error: 'Forbidden: not your order' });
      return;
    }
    const allowedStatuses = ['paid', 'confirmed', 'preparing', 'delivering', 'delivered'];
    if (!allowedStatuses.includes(order.status)) {
      reply.status(400).send({ error: 'Bad Request: order status does not allow this action' });
      return;
    }
    const updated = await this.ordersService.updateStatus(order.id, 'received');
    reply.send(updated);
  }

  async markNotDelivered(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as { id: string };
    const params = request.params as { id: string };
    const order = await this.ordersService.findUserOrder(params.id, user.id);
    if (!order) {
      reply.status(403).send({ error: 'Forbidden: not your order' });
      return;
    }
    const allowedStatuses = ['paid', 'confirmed', 'preparing', 'delivering'];
    if (!allowedStatuses.includes(order.status)) {
      reply.status(400).send({ error: 'Bad Request: order status does not allow this action' });
      return;
    }
    const updated = await this.ordersService.updateStatus(order.id, 'delivery_issue');
    reply.send(updated);
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { id: string };
    await this.ordersService.delete(params.id);
    reply.status(204).send();
  }
}