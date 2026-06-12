import { FastifyRequest, FastifyReply, RouteGenericInterface } from 'fastify';

interface IdParam {
  id: string;
}

export async function createSession(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const chatService = request.server.chatService;
    const body = request.body as { guestId?: string; userName?: string; userId?: string } | null;
    const guestId = body?.guestId || 'guest-' + Date.now();
    const session = await chatService.createSession({
      guestId,
      userId: body?.userId || undefined,
      userName: body?.userName || 'Гость',
    });
    return reply.status(201).send(session);
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ error: 'Ошибка создания сессии' });
  }
}

export async function getSessions(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const chatService = request.server.chatService;
    const sessions = await chatService.getAllSessions();
    return reply.send(sessions);
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ error: 'Ошибка получения сессий' });
  }
}

export async function getSessionMessages(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const chatService = request.server.chatService;
    const params = request.params as IdParam;
    const session = await chatService.getSessionById(params.id);
    if (!session) {
      return reply.status(404).send({ error: 'Сессия не найдена' });
    }
    return reply.send(session);
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ error: 'Ошибка получения сообщений' });
  }
}

export async function sendMessage(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const chatService = request.server.chatService;
    const params = request.params as IdParam;
    const body = request.body as { content?: string; senderType?: 'user' | 'admin'; attachment?: string } | null;
    const content = body?.content;
    const senderType = body?.senderType || 'user';
    const attachment = body?.attachment;

    if (!content?.trim()) {
      return reply.status(400).send({ error: 'Текст сообщения обязателен' });
    }

    const message = await chatService.sendMessage({
      sessionId: params.id,
      senderType,
      content: content.trim(),
      attachment,
    });

    return reply.status(201).send(message);
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ error: 'Ошибка отправки сообщения' });
  }
}

export async function sendToUser(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const chatService = request.server.chatService;
    const params = request.params as { userId: string };
    const body = request.body as { content: string } | null;
    const content = body?.content;

    if (!content?.trim()) {
      return reply.status(400).send({ error: 'Текст сообщения обязателен' });
    }

    // Находим сессию для пользователя
    let session = await chatService.findSessionByUserId(params.userId);
    if (!session) {
      // Создаём новую сессию для пользователя
      session = await chatService.createSession({
        userId: params.userId,
        guestId: 'user-' + params.userId,
        userName: 'Пользователь',
      }) as any;
    }

    if (!session) {
      return reply.status(500).send({ error: 'Не удалось создать сессию' });
    }

    const message = await chatService.sendMessage({
      sessionId: session.id,
      senderType: 'admin',
      content: content.trim(),
    });

    return reply.status(201).send(message);
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ error: 'Ошибка отправки сообщения' });
  }
}

export async function markAsRead(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const chatService = request.server.chatService;
    const params = request.params as IdParam;
    const message = await chatService.markAsRead(params.id);
    return reply.send(message);
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ error: 'Ошибка обновления статуса' });
  }
}

export async function markAllAsRead(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const chatService = request.server.chatService;
    const params = request.params as IdParam;
    const body = request.body as { senderType?: string } | null;
    await chatService.markAllAsRead(params.id, body?.senderType || 'admin');
    return reply.send({ success: true });
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ error: 'Ошибка обновления статусов' });
  }
}

export async function getPublicMessages(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const chatService = request.server.chatService;
    const params = request.params as IdParam;
    const query = request.query as { guestId?: string };

    // Получаем сессию
    const session = await chatService.getSessionById(params.id);
    if (!session) {
      return reply.status(404).send({ error: 'Сессия не найдена' });
    }

    // Проверяем guestId (только владелец сессии может её читать)
    if (query.guestId && session.guestId !== query.guestId) {
      return reply.status(403).send({ error: 'Доступ запрещён' });
    }

    // Возвращаем только сообщения (без user данных)
    return reply.send({
      id: session.id,
      guestId: session.guestId,
      userName: session.userName,
      status: session.status,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      messages: session.messages || [],
    });
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ error: 'Ошибка получения сообщений' });
  }
}

export async function closeSession(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const chatService = request.server.chatService;
    const params = request.params as IdParam;
    const session = await chatService.closeSession(params.id);
    return reply.send(session);
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ error: 'Ошибка закрытия сессии' });
  }
}

export async function getSessionByUser(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const chatService = request.server.chatService;
    const params = request.params as { userId: string };
    const session = await chatService.findSessionByUserId(params.userId);
    if (!session) {
      return reply.status(404).send({ error: 'Сессия не найдена' });
    }
    return reply.send(session);
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ error: 'Ошибка поиска сессии' });
  }
}

export async function getUnreadCount(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const chatService = request.server.chatService;
    const count = await chatService.getUnreadCount();
    return reply.send({ count });
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ error: 'Ошибка получения количества' });
  }
}
