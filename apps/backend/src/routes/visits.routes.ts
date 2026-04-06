import { FastifyInstance } from 'fastify';
import { VisitsController } from '../controllers/visits.controller';
import { VisitsService } from '../services/visits.service';
import { verifyJWT } from '../middleware/auth';

export async function visitsRoutes(server: FastifyInstance) {
  const visitsService = new VisitsService(server.prisma);
  const visitsController = new VisitsController(visitsService);

  server.post('/track', {
    preHandler: verifyJWT,
  }, visitsController.track.bind(visitsController));

  server.get('/stats', {
    preHandler: verifyJWT,
  }, visitsController.getStats.bind(visitsController));

  server.get('/recent', {
    preHandler: verifyJWT,
  }, visitsController.getRecent.bind(visitsController));
}