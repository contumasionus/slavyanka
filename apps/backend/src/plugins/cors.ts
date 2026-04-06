import { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';

export async function corsPlugin(server: FastifyInstance) {
  await server.register(cors, {
    origin: true,
    credentials: true,
  });
}