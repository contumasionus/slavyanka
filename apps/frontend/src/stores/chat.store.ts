import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { chatApi } from '../api/chat.api';
import type { ChatMessage, ChatSession, QuickAnswer } from '../types/chat';
import { useAuthStore } from './auth.store';

const STORAGE_KEY_MESSAGES = 'chat-messages';
const STORAGE_KEY_SESSION = 'chat-session-id';
const STORAGE_KEY_GUEST = 'chat-guest-id';
const STORAGE_KEY_USER_HASH = 'chat-user-hash';

export const useChatStore = defineStore('chat', () => {
  const session = ref<ChatSession | null>(null);
  const sessionId = ref<string | null>(localStorage.getItem(STORAGE_KEY_SESSION));
  const guestId = ref<string | null>(localStorage.getItem(STORAGE_KEY_GUEST));
  const messages = ref<ChatMessage[]>(loadMessages());
  const isOpen = ref(false);
  const isLoading = ref(false);
  const unreadCount = ref(0);
  const ws = ref<WebSocket | null>(null);
  const lastAdminMessageId = ref<string | null>(null);
  const pollingInterval = ref<ReturnType<typeof setInterval> | null>(null);

  // Загрузка сообщений из localStorage
  function loadMessages(): ChatMessage[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MESSAGES);
      if (saved) {
        const parsed = JSON.parse(saved) as ChatMessage[];
        const lastAdmin = [...parsed].reverse().find(m => m.senderType === 'admin');
        if (lastAdmin) lastAdminMessageId.value = lastAdmin.id;
        return parsed;
      }
    } catch (e) {
      console.error('Failed to load chat messages:', e);
    }
    return [];
  }

  // Сохранение сообщений в localStorage
  function saveMessages() {
    try {
      localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages.value));
    } catch (e) {
      console.error('Failed to save chat messages:', e);
    }
  }

  // Вычислить хеш текущего пользователя для детекции смены
  function computeUserHash(): string {
    const auth = useAuthStore();
    if (auth.isAuthenticated && auth.user?.id) {
      return 'user_' + auth.user.id;
    }
    return 'guest_' + (guestId.value || 'unknown');
  }

  // Быстрые ответы (4 штуки)
  const quickAnswers: QuickAnswer[] = [
    {
      question: 'Как заказать товар?',
      answer: 'Чтобы заказать товар, выберите понравившийся товар в каталоге, добавьте его в корзину, перейдите в корзину и оформите заказ. После этого наш менеджер свяжется с вами для подтверждения.',
    },
    {
      question: 'Сколько стоит доставка?',
      answer: 'Стоимость доставки зависит от вашего региона и суммы заказа. В черте города доставка бесплатная при заказе от 1500₽. В регионы стоимость доставки рассчитывается индивидуально.',
    },
    {
      question: 'Как оплатить заказ?',
      answer: 'Вы можете оплатить заказ наличными при получении, банковской картой онлайн или по QR-коду. При оформлении заказа наш менеджер предложит удобный способ оплаты.',
    },
    {
      question: 'Можно вернуть товар?',
      answer: 'Да, вы можете вернуть товар в течение 14 дней с момента получения при сохранении упаковки и чеков. Обратитесь к нашему менеджеру для оформления возврата.',
    },
  ];

  // Быстрые кнопки показывать когда:
  // - нет сообщений (начало чата), ИЛИ
  // - последнее сообщение от админа (после каждого ответа поддержки)
  const showQuickAnswers = computed(() => {
    if (messages.value.length === 0) return true;
    const lastMsg = messages.value[messages.value.length - 1];
    return lastMsg.senderType === 'admin';
  });

  // Звуковое уведомление
  function playNotificationSound() {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      console.log('Audio notification not supported');
    }
  }

  // Полный сброс чата — при logout или смене пользователя
  function clearChat() {
    stopPolling();
    // Сбрасываем состояние
    session.value = null;
    sessionId.value = null;
    guestId.value = null;
    messages.value = [];
    isOpen.value = false;
    isLoading.value = false;
    unreadCount.value = 0;
    lastAdminMessageId.value = null;

    // Удаляем из localStorage
    const keys = [STORAGE_KEY_SESSION, STORAGE_KEY_GUEST, STORAGE_KEY_MESSAGES, STORAGE_KEY_USER_HASH];
    keys.forEach(key => localStorage.removeItem(key));
  }

  // Создать или восстановить сессию
  async function initSession(userName?: string) {
    try {
      isLoading.value = true;

      // Определяем userId, если пользователь авторизован
      const auth = useAuthStore();
      const currentUserId = auth.isAuthenticated && auth.user?.id ? auth.user.id : undefined;

      // Проверяем, не сменился ли пользователь
      const savedHash = localStorage.getItem(STORAGE_KEY_USER_HASH);
      const currentHash = computeUserHash();

      if (savedHash && savedHash !== currentHash) {
        // Пользователь сменился — очищаем старый чат
        console.log('[Chat] User changed, clearing previous session');
        clearChat();
        // После clearChat sessionId и guestId — null, поэтому создадим новую сессию
        const newSession = await chatApi.createSession(userName, currentUserId);
        session.value = newSession;
        sessionId.value = newSession.id;
        guestId.value = localStorage.getItem(STORAGE_KEY_GUEST);
        messages.value = [];
        localStorage.setItem(STORAGE_KEY_SESSION, newSession.id);
        localStorage.setItem(STORAGE_KEY_USER_HASH, computeUserHash());
        return;
      }

      if (sessionId.value && guestId.value) {
        // Пробуем восстановить сессию через публичный endpoint
        try {
          const existingSession = await chatApi.getPublicMessages(sessionId.value, guestId.value);
          if (existingSession) {
            session.value = existingSession;

            // Синхронизируем сообщения с сервером
            if (messages.value.length === 0 && existingSession.messages) {
              messages.value = existingSession.messages;
              saveMessages();
            } else if (existingSession.messages && existingSession.messages.length > messages.value.length) {
              // Если на сервере больше сообщений — объединяем
              const serverIds = new Set(existingSession.messages.map(m => m.id));
              const merged = [...messages.value];
              for (const msg of existingSession.messages) {
                if (!serverIds.has(msg.id)) {
                  merged.push(msg);
                }
              }
              messages.value = merged;
              saveMessages();
            }

            const lastAdmin = [...messages.value].reverse().find(m => m.senderType === 'admin');
            if (lastAdmin) lastAdminMessageId.value = lastAdmin.id;

            localStorage.setItem(STORAGE_KEY_USER_HASH, computeUserHash());
            return;
          }
        } catch {
          // Сессия не найдена — создаем новую
          clearChat();
        }
      }

      // Создаем новую сессию с userId, если пользователь авторизован
      const newSession = await chatApi.createSession(userName, currentUserId);
      session.value = newSession;
      sessionId.value = newSession.id;
      guestId.value = localStorage.getItem(STORAGE_KEY_GUEST);
      messages.value = [];
      saveMessages();
      localStorage.setItem(STORAGE_KEY_SESSION, newSession.id);
      localStorage.setItem(STORAGE_KEY_USER_HASH, computeUserHash());
    } catch (error) {
      console.error('Failed to init chat session:', error);
    } finally {
      isLoading.value = false;
      startPolling();
    }
  }

  // Запуск polling — проверка новых сообщений от админа каждые 5 секунд
  function startPolling() {
    stopPolling();
    if (!sessionId.value) return;
    pollingInterval.value = setInterval(async () => {
      if (!sessionId.value || !guestId.value) return;
      try {
        const serverSession = await chatApi.getPublicMessages(sessionId.value, guestId.value);
        if (!serverSession?.messages) return;

        const localIds = new Set(messages.value.map(m => m.id));

        // Ищем новые сообщения от админа, которых нет локально
        let hasNew = false;
        for (const serverMsg of serverSession.messages) {
          if (!localIds.has(serverMsg.id) && serverMsg.senderType === 'admin') {
            messages.value.push(serverMsg);
            hasNew = true;
            // Если чат закрыт — увеличиваем счётчик непрочитанных
            if (!isOpen.value) {
              unreadCount.value++;
            }
            playNotificationSound();
          }
        }

        if (hasNew) {
          saveMessages();
          // Обновляем lastAdminMessageId
          const lastAdmin = [...messages.value].reverse().find(m => m.senderType === 'admin');
          if (lastAdmin) lastAdminMessageId.value = lastAdmin.id;
        }
      } catch {
        // Если ошибка — просто игнорируем
      }
    }, 5000);
  }

  // Остановка polling
  function stopPolling() {
    if (pollingInterval.value !== null) {
      clearInterval(pollingInterval.value);
      pollingInterval.value = null;
    }
  }

  // Отправить сообщение
  async function sendMessage(content: string, attachment?: string) {
    if (!sessionId.value || !content.trim()) return;

    const tempId = 'temp-' + Date.now();
    const tempMessage: ChatMessage = {
      id: tempId,
      sessionId: sessionId.value,
      senderType: 'user',
      content: content.trim(),
      attachment: attachment || null,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    // Optimistic update
    messages.value.push(tempMessage);
    saveMessages();

    try {
      const savedMessage = await chatApi.sendMessage(sessionId.value, content.trim(), 'user', attachment);

      const index = messages.value.findIndex(m => m.id === tempId);
      if (index !== -1) {
        messages.value[index] = savedMessage;
        saveMessages();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const index = messages.value.findIndex(m => m.id === tempId);
      if (index !== -1) {
        messages.value[index].content = '⚠️ ' + messages.value[index].content;
        saveMessages();
      }
    }

  }

  // Добавить автоматический ответ (для быстрых вопросов)
  function addAutoReply(content: string) {
    const msg: ChatMessage = {
      id: 'auto-' + Date.now(),
      sessionId: sessionId.value || '',
      senderType: 'admin' as const,
      content,
      attachment: null,
      isRead: true,
      createdAt: new Date().toISOString(),
    };
    messages.value.push(msg);
    lastAdminMessageId.value = msg.id;
    saveMessages();
  }

  function toggleChat() {
    isOpen.value = !isOpen.value;
    if (!isOpen.value) {
      unreadCount.value = 0;
    }
  }

  function openChat() {
    isOpen.value = true;
    unreadCount.value = 0;
  }

  function resetUnread() {
    unreadCount.value = 0;
  }

  return {
    session,
    sessionId,
    messages,
    isOpen,
    isLoading,
    unreadCount,
    quickAnswers,
    showQuickAnswers,
    clearChat,
    initSession,
    connectWebSocket: startPolling,
    startPolling,
    stopPolling,
    sendMessage,
    addAutoReply,
    toggleChat,
    openChat,
    resetUnread,
    playNotificationSound,
  };
});