import { FastifyRequest, FastifyReply } from 'fastify';
import { ProductsService } from '../services/products.service';

export class ProductsController {
  constructor(private productsService: ProductsService) {}

  async getAll(request: FastifyRequest, reply: FastifyReply) {
    const products = await this.productsService.findAll();
    reply.send(products);
  }

  async getById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const product = await this.productsService.findById(request.params.id);
    if (!product) {
      reply.status(404).send({ error: 'Product not found' });
      return;
    }
    reply.send(product);
  }

  async getByCategory(request: FastifyRequest<{ Params: { slug: string } }>, reply: FastifyReply) {
    const products = await this.productsService.findByCategory(request.params.slug);
    reply.send(products);
  }

  async create(request: FastifyRequest<{ Body: { name: string; description?: string; price: number; weight?: string; imageUrl?: string; categoryId: string; inStock?: boolean; deliveryDate?: string } }>, reply: FastifyReply) {
    try {
      const product = await this.productsService.create(request.body);
      reply.status(201).send(product);
    } catch (error: any) {
      reply.status(400).send({ error: error.message || 'Failed to create product' });
    }
  }

  async update(request: FastifyRequest<{ Params: { id: string }; Body: Partial<{ name: string; description?: string; price: number; weight?: string; imageUrl?: string; categoryId: string; inStock?: boolean; deliveryDate?: string }> }>, reply: FastifyReply) {
    try {
      const product = await this.productsService.update(request.params.id, request.body);
      reply.send(product);
    } catch (error: any) {
      reply.status(400).send({ error: error.message || 'Failed to update product' });
    }
  }

  async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    await this.productsService.delete(request.params.id);
    reply.status(204).send();
  }
}