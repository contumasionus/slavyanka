import { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '../db';

function makePromoCode(): string {
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `SLAVYANKA-${digits}`;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function validatePromoCode(
  request: FastifyRequest<{ Body: { code: string } }>,
  reply: FastifyReply
) {
  const { code } = request.body;

  if (!code || !code.trim()) {
    return reply.status(400).send({ valid: false, error: 'Введите промокод' });
  }

  const normalizedCode = code.trim().toUpperCase();

  try {
    const promo = await prisma.promoCode.findUnique({
      where: { code: normalizedCode },
    });

    if (!promo) {
      return reply.send({ valid: false, error: 'Неверный промокод' });
    }

    if (new Date() > promo.expiresAt) {
      return reply.send({ valid: false, error: 'Срок действия промокода истёк' });
    }

    return reply.send({ valid: true, discount: 10, message: 'Промокод применён — скидка 10%' });
  } catch (error) {
    console.error('Ошибка валидации промокода:', error);
    return reply.status(500).send({ valid: false, error: 'Произошла ошибка. Попробуйте позже.' });
  }
}

export async function generatePromoCode(
  request: FastifyRequest<{ Body: { email: string } }>,
  reply: FastifyReply
) {
  const { email } = request.body;

  if (!email || !isValidEmail(email)) {
    return reply.status(400).send({ error: 'Пожалуйста, введите корректный email адрес' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const existing = await prisma.promoCode.findFirst({
      where: { email: normalizedEmail },
      orderBy: { createdAt: 'desc' },
    });

    if (existing) {
      return reply.send({
        promoCode: existing.code,
        expiresIn: '30 дней',
        alreadyUsed: true,
        message: 'Вы уже получали промокод',
      });
    }

    const code = makePromoCode();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    await prisma.promoCode.create({
      data: {
        email: normalizedEmail,
        code,
        expiresAt,
      },
    });

    return reply.send({
      promoCode: code,
      expiresIn: '30 дней',
      alreadyUsed: false,
      message: 'Ваш промокод готов!',
    });
  } catch (error) {
    console.error('Ошибка генерации промокода:', error);
    return reply.status(500).send({ error: 'Произошла ошибка. Попробуйте позже.' });
  }
}