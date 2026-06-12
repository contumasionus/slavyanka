import { FastifyRequest, FastifyReply } from 'fastify';
import { ProductsService } from '../services/products.service';

export class ProductsController {
  constructor(private productsService: ProductsService) {}

  async getAll(request: FastifyRequest, reply: FastifyReply) {
    const products = await this.productsService.findAll();
    reply.send(products);
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { id: string };
    const product = await this.productsService.findById(params.id);
    if (!product) {
      reply.status(404).send({ error: 'Product not found' });
      return;
    }
    reply.send(product);
  }

  async getByCategory(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { slug: string };
    const products = await this.productsService.findByCategory(params.slug);
    reply.send(products);
  }

  async getPromo(request: FastifyRequest, reply: FastifyReply) {
    const products = await this.productsService.findPromo();
    reply.send(products);
  }

  async search(request: FastifyRequest, reply: FastifyReply) {
    const query = (request.query as { q?: string }).q || '';
    if (!query.trim()) {
      reply.send([]);
      return;
    }
    const products = await this.productsService.search(query);
    reply.send(products);
  }

  async getViewed(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as { id: string };
    const products = await this.productsService.getViewed(user.id);
    reply.send(products);
  }

  async recordView(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as { id: string };
    const body = request.body as { productId: string };
    await this.productsService.recordView(user.id, body.productId);
    reply.status(200).send({ ok: true });
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const product = await this.productsService.create(request.body as any);
      reply.status(201).send(product);
    } catch (error: any) {
      reply.status(400).send({ error: error.message || 'Failed to create product' });
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const params = request.params as { id: string };
      const product = await this.productsService.update(params.id, request.body as any);
      reply.send(product);
    } catch (error: any) {
      reply.status(400).send({ error: error.message || 'Failed to update product' });
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { id: string };
    await this.productsService.delete(params.id);
    reply.status(204).send();
  }
}