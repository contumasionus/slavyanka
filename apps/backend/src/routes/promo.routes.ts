import { FastifyInstance } from 'fastify';
import { generatePromoCode, validatePromoCode } from '../controllers/promo.controller';

export async function promoRoutes(server: FastifyInstance) {
  server.post('/generate', generatePromoCode);
  server.post('/validate', validatePromoCode);
}
