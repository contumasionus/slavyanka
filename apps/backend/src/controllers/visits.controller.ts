import { FastifyRequest, FastifyReply } from 'fastify';
import { VisitsService } from '../services/visits.service';

export class VisitsController {
  constructor(private visitsService: VisitsService) {}

  async track(request: any, reply: FastifyReply) {
    try {
      const user = request.user as { id: string };
      const visit = await this.visitsService.trackVisit(user.id);
      reply.status(201).send(visit);
    } catch (error) {
      reply.status(500).send({ error: (error as Error).message });
    }
  }

  async getStats(request: any, reply: FastifyReply) {
    try {
      const user = request.user as { id: string };
      const stats = await this.visitsService.getVisitStats(user.id);
      reply.send(stats);
    } catch (error) {
      reply.status(500).send({ error: (error as Error).message });
    }
  }

  async getRecent(request: any, reply: FastifyReply) {
    try {
      const user = request.user as { id: string };
      const limit = request.query.limit ? parseInt(request.query.limit) : 10;
      const visits = await this.visitsService.getRecentVisits(user.id, limit);
      reply.send(visits);
    } catch (error) {
      reply.status(500).send({ error: (error as Error).message });
    }
  }
}