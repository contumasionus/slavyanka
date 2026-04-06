import { FastifyRequest, FastifyReply } from 'fastify';

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: 'Unauthorized' });
  }
}

export async function verifyAdmin(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
    const user = request.user as { role: string };
    if (user.role !== 'admin') {
      reply.status(403).send({ error: 'Forbidden: Admin access required' });
    }
  } catch (err) {
    reply.status(401).send({ error: 'Unauthorized' });
  }
}