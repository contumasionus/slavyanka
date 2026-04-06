import { FastifyRequest, FastifyReply } from 'fastify';
import { OrdersService } from '../services/orders.service';

export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  async getAll(request: FastifyRequest, reply: FastifyReply) {
    const orders = await this.ordersService.findAll();
    reply.send(orders);
  }

  async getById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const order = await this.ordersService.findById(request.params.id);
    if (!order) {
      reply.status(404).send({ error: 'Order not found' });
      return;
    }
    reply.send(order);
  }

  async updateStatus(request: FastifyRequest<{ Params: { id: string }; Body: { status: string } }>, reply: FastifyReply) {
    const order = await this.ordersService.updateStatus(request.params.id, request.body.status);
    reply.send(order);
  }
}