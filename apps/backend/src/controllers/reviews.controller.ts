import { FastifyRequest, FastifyReply } from 'fastify';
import { ReviewsService } from '../services/reviews.service';

export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  async getByProduct(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { productId: string };
    const reviews = await this.reviewsService.findByProduct(params.productId);
    reply.send(reviews);
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as { id: string };
    const body = request.body as { productId: string; rating: number; text?: string; photo?: string };
    try {
      const review = await this.reviewsService.create({
        userId: user.id,
        ...body,
      });
      reply.status(201).send(review);
    } catch (error: any) {
      reply.status(400).send({ error: error.message || 'Failed to create review' });
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { id: string };
    try {
      await this.reviewsService.delete(params.id);
      reply.status(204).send();
    } catch (error: any) {
      reply.status(400).send({ error: error.message || 'Failed to delete review' });
    }
  }
}