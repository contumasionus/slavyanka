import { FastifyRequest, FastifyReply } from 'fastify';
import { NewsService } from '../services/news.service';

export class NewsController {
  constructor(private newsService: NewsService) {}

  async getAll(request: FastifyRequest, reply: FastifyReply) {
    const news = await this.newsService.findAll(true);
    reply.send(news);
  }

  async getAllAdmin(request: FastifyRequest, reply: FastifyReply) {
    const news = await this.newsService.findAll(false);
    reply.send(news);
  }

  async getBySlug(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { slug: string };
    const item = await this.newsService.findBySlug(params.slug);
    if (!item) {
      reply.status(404).send({ error: 'News not found' });
      return;
    }
    reply.send(item);
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { id: string };
    const item = await this.newsService.findById(params.id);
    if (!item) {
      reply.status(404).send({ error: 'News not found' });
      return;
    }
    reply.send(item);
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const news = await this.newsService.create(request.body as any);
      reply.status(201).send(news);
    } catch (error: any) {
      reply.status(400).send({ error: error.message || 'Failed to create news' });
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const params = request.params as { id: string };
      const news = await this.newsService.update(params.id, request.body as any);
      reply.send(news);
    } catch (error: any) {
      reply.status(400).send({ error: error.message || 'Failed to update news' });
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { id: string };
    await this.newsService.delete(params.id);
    reply.status(204).send();
  }
}