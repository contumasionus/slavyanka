import { FastifyRequest, FastifyReply } from 'fastify';
import { CategoriesService } from '../services/categories.service';

export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  async getAll(request: FastifyRequest, reply: FastifyReply) {
    const categories = await this.categoriesService.findAll();
    reply.send(categories);
  }

  async getBySlug(request: FastifyRequest<{ Params: { slug: string } }>, reply: FastifyReply) {
    const category = await this.categoriesService.findBySlug(request.params.slug);
    if (!category) {
      reply.status(404).send({ error: 'Category not found' });
      return;
    }
    reply.send(category);
  }

  async create(request: FastifyRequest<{ Body: { name: string; slug: string; description?: string; imageUrl?: string } }>, reply: FastifyReply) {
    const category = await this.categoriesService.create(request.body);
    reply.status(201).send(category);
  }

  async update(request: FastifyRequest<{ Params: { id: string }; Body: Partial<{ name: string; slug: string; description?: string; imageUrl?: string }> }>, reply: FastifyReply) {
    const category = await this.categoriesService.update(request.params.id, request.body);
    reply.send(category);
  }

  async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    await this.categoriesService.delete(request.params.id);
    reply.status(204).send();
  }
}