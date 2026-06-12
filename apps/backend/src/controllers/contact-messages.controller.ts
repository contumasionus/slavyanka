import { FastifyRequest, FastifyReply } from 'fastify';
import { ContactMessagesService } from '../services/contact-messages.service';
import prisma from '../db';

export async function createMessage(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const service = new ContactMessagesService(prisma);
    const body = request.body as { name?: string; email?: string; phone?: string; topic?: string; message?: string };

    if (!body.name?.trim() || !body.email?.trim() || !body.message?.trim()) {
      return reply.status(400).send({ error: 'Имя, email и сообщение обязательны' });
    }

    const message = await service.create({
      name: body.name.trim(),
      email: body.email.trim(),
      phone: body.phone || '',
      topic: body.topic || '',
      message: body.message.trim(),
    });

    return reply.status(201).send(message);
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ error: 'Ошибка создания отзыва' });
  }
}

export async function getMessages(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const service = new ContactMessagesService(prisma);
    const messages = await service.getAll();
    return reply.send(messages);
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ error: 'Ошибка получения отзывов' });
  }
}

export async function replyToMessage(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const service = new ContactMessagesService(prisma);
    const params = request.params as { id: string };
    const body = request.body as { adminReply?: string };

    if (!body.adminReply?.trim()) {
      return reply.status(400).send({ error: 'Текст ответа обязателен' });
    }

    const existing = await service.getById(params.id);
    if (!existing) {
      return reply.status(404).send({ error: 'Отзыв не найден' });
    }

    const updated = await service.reply(params.id, body.adminReply.trim());

    // Отправляем email пользователю
    const { sendReplyEmail } = await import('../services/email.service');
    const topicMap: Record<string, string> = {
      feedback: 'Отзыв о магазине',
      question: 'Вопрос по товару',
      complaint: 'Жалоба / предложение',
      delivery: 'Вопрос по доставке',
      other: 'Другое',
    };

    await sendReplyEmail({
      to: existing.email,
      name: existing.name,
      topic: topicMap[existing.topic] || existing.topic,
      message: existing.message,
      reply: body.adminReply.trim(),
    });

    return reply.send(updated);
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ error: 'Ошибка ответа на отзыв' });
  }
}