import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function prismaPlugin(server: FastifyInstance) {
  server.decorate('prisma', prisma);

  server.addHook('onClose', async () => {
    await prisma.$disconnect();
  });
}

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}