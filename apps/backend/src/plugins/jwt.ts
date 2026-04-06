import { FastifyInstance } from 'fastify';
import jwt from '@fastify/jwt';

export async function jwtPlugin(server: FastifyInstance) {
  await server.register(jwt, {
    secret: process.env.JWT_SECRET || 'slavyanka-secret-key-change-in-production',
  });
}