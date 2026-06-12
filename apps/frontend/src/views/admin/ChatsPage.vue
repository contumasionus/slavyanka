<template>
  <div class="chats-page">
    <div class="chats-page__header">
      <h1 class="chats-page__title">Чаты поддержки</h1>
      <button class="chats-page__refresh" @click="loadSessions">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
        Обновить
      </button>
    </div>

    <div class="chats-page__layout">
      <!-- Список чатов -->
      <aside class="chats-page__sidebar">
        <div v-if="loading" class="chats-page__loading">
          <div class="chats-page__skeleton" v-for="i in 5" :key="i"></div>
        </div>

        <div v-else-if="sessions.length === 0" class="chats-page__empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color: #94a3b8;">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <p>Нет активных чатов</p>
        </div>

        <div v-else class="chats-page__list">
          <button
            v-for="session in sessions"
            :key="session.id"
            class="chats-page__session"
            :class="{ 'chats-page__session--active': selectedId === session.id, 'chats-page__session--unread': hasUnread(session) }"
            @click="selectSession(session.id)"
          >
            <div class="chats-page__session-avatar">
              {{ getUserInitial(session) }}
            </div>
            <div class="chats-page__session-info">
              <div class="chats-page__session-name">{{ session.userName || 'Гость' }}</div>
              <div class="chats-page__session-preview">{{ getLastMessage(session) }}</div>
            </div>
            <div class="chats-page__session-meta">
              <div class="chats-page__session-time">{{ formatDate(session.updatedAt) }}</div>
              <div v-if="session.status === 'active'" class="chats-page__session-status chats-page__session-status--active">Активен</div>
              <div v-else class="chats-page__session-status chats-page__session-status--closed">Закрыт</div>
            </div>
          </button>
        </div>
      </aside>

      <!-- Переписка -->
      <main class="chats-page__messages">
        <div v-if="!selectedSession" class="chats-page__placeholder">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color: #cbd5e1;">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <p>Выберите чат для просмотра переписки</p>
        </div>

        <template v-else>
          <div class="chats-page__chat-header">
            <div class="chats-page__chat-user">
              <div class="chats-page__chat-avatar">{{ getUserInitial(selectedSession) }}</div>
              <div>
                <div class="chats-page__chat-name">{{ selectedSession.userName || 'Гость' }}</div>
                <div class="chats-page__chat-subtitle">
                  ID: {{ selectedSession.guestId }} • 
                  {{ selectedSession.status === 'active' ? 'Активен' : 'Закрыт' }}
                </div>
              </div>
            </div>
            <div class="chats-page__chat-actions">
              <button
                v-if="selectedSession.status === 'active'"
                class="chats-page__action-btn chats-page__action-btn--close"
                @click="handleCloseSession"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                Закрыть чат
              </button>
            </div>
          </div>

          <div class="chats-page__messages-list" ref="messagesRef">
            <div
              v-for="msg in messages"
              :key="msg.id"
              class="chats-page__msg"
              :class="{
                'chats-page__msg--user': msg.senderType === 'user',
                'chats-page__msg--admin': msg.senderType === 'admin',
              }"
            >
              <div class="chats-page__msg-bubble">
                <p>{{ msg.content }}</p>
                <div v-if="msg.attachment" class="chats-page__msg-attachment">
                  <img :src="msg.attachment" alt="Attachment" @click="openImage(msg.attachment || '')" />
                </div>
                <div class="chats-page__msg-meta">
                  {{ formatTime(msg.createdAt) }}
                  <span v-if="msg.senderType === 'user'" class="chats-page__msg-status">
                    {{ msg.isRead ? '✓ Прочитано' : '✓ Отправлено' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="selectedSession.status === 'active'" class="chats-page__input-area">
            <textarea
              v-model="adminMessage"
              class="chats-page__input"
              placeholder="Введите ответ..."
              @keydown.ctrl.enter="handleAdminSend"
              :disabled="isSending"
              rows="2"
            ></textarea>
            <button
              class="chats-page__send-btn"
              :disabled="!adminMessage.trim() || isSending"
              @click="handleAdminSend"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              Отправить
            </button>
          </div>
        </template>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { chatApi } from '../../api/chat.api';
import type { ChatSession, ChatMessage } from '../../types/chat';

const sessions = ref<ChatSession[]>([]);
const selectedId = ref<string | null>(null);
const selectedSession = ref<ChatSession | null>(null);
const messages = ref<ChatMessage[]>([]);
const loading = ref(true);
const isSending = ref(false);
const adminMessage = ref('');
const messagesRef = ref<HTMLElement | null>(null);

onMounted(() => {
  loadSessions();
});

watch(selectedId, async (newId) => {
  if (newId) {
    await loadMessages(newId);
  }
});

watch(messages, async () => {
  await nextTick();
  scrollToBottom();
}, { deep: true });

async function loadSessions() {
  loading.value = true;
  try {
    sessions.value = await chatApi.getSessions();
  } catch (error) {
    console.error('Failed to load sessions:', error);
  } finally {
    loading.value = false;
  }
}

async function loadMessages(sessionId: string) {
  try {
    const session = await chatApi.getSessionMessages(sessionId);
    selectedSession.value = session;
    messages.value = session.messages || [];

    // Отмечаем как прочитанные
    await chatApi.markAllAsRead(sessionId, 'user');
  } catch (error) {
    console.error('Failed to load messages:', error);
  }
}

async function selectSession(sessionId: string) {
  selectedId.value = sessionId;
}

function hasUnread(session: ChatSession): boolean {
  if (session.messages && session.messages.length > 0) {
    const lastMsg = session.messages[0];
    return lastMsg.senderType === 'user' && !lastMsg.isRead;
  }
  return false;
}

function getLastMessage(session: ChatSession): string {
  if (session.messages && session.messages.length > 0) {
    const msg = session.messages[0];
    const prefix = msg.senderType === 'admin' ? 'Вы: ' : 'Клиент: ';
    return prefix + (msg.content.length > 50 ? msg.content.slice(0, 50) + '...' : msg.content);
  }
  return 'Нет сообщений';
}

function getUserInitial(session: ChatSession): string {
  return (session.userName || 'Г').charAt(0).toUpperCase();
}

async function handleAdminSend() {
  if (!adminMessage.value.trim() || !selectedId.value || isSending.value) return;

  isSending.value = true;
  const text = adminMessage.value;
  adminMessage.value = '';

  try {
    const msg = await chatApi.sendMessage(selectedId.value, text, 'admin');
    messages.value.push(msg);
    await loadSessions();
  } catch (error) {
    console.error('Failed to send admin message:', error);
  } finally {
    isSending.value = false;
  }
}

async function handleCloseSession() {
  if (!selectedId.value) return;
  try {
    await chatApi.closeSession(selectedId.value);
    await loadSessions();
    if (selectedSession.value) {
      selectedSession.value.status = 'closed';
    }
  } catch (error) {
    console.error('Failed to close session:', error);
  }
}

function scrollToBottom() {
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight;
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / 3600000);

  if (hours < 1) return 'Только что';
  if (hours < 24) return `${hours}ч назад`;
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

function openImage(url: string) {
  window.open(url, '_blank');
}
</script>

<style scoped>
.chats-page {
  padding: 24px;
  height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
}

.chats-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.chats-page__title {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 24px;
  color: var(--color-text);
}

.chats-page__refresh {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  font-family: var(--font-heading);
  font-weight: 500;
  font-size: 13px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.chats-page__refresh:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* Layout */
.chats-page__layout {
  display: flex;
  gap: 20px;
  flex: 1;
  min-height: 0;
}

/* Sidebar */
.chats-page__sidebar {
  width: 340px;
  flex-shrink: 0;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
  overflow-y: auto;
}

.chats-page__loading {
  padding: 16px;
}

.chats-page__skeleton {
  height: 64px;
  background: var(--color-border-light);
  border-radius: var(--radius-md);
  margin-bottom: 8px;
  animation: skeleton-shimmer 1.8s ease-in-out infinite;
}

.chats-page__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 48px 24px;
  color: var(--color-text-muted);
  font-size: 14px;
}

.chats-page__list {
  display: flex;
  flex-direction: column;
}

.chats-page__session {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: none;
  background: none;
  width: 100%;
  cursor: pointer;
  transition: background var(--transition-fast);
  border-bottom: 1px solid var(--color-border-light);
  text-align: left;
}

.chats-page__session:hover {
  background: var(--color-primary-soft);
}

.chats-page__session--active {
  background: var(--color-primary-soft);
  border-left: 3px solid var(--color-primary);
}

.chats-page__session--unread {
  background: var(--color-primary-soft);
}

.chats-page__session-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 16px;
  flex-shrink: 0;
}

.chats-page__session-info {
  flex: 1;
  min-width: 0;
}

.chats-page__session-name {
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 13px;
  color: var(--color-text);
  margin-bottom: 2px;
}

.chats-page__session-preview {
  font-size: 12px;
  color: var(--color-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chats-page__session-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  flex-shrink: 0;
}

.chats-page__session-time {
  font-size: 11px;
  color: var(--color-text-muted);
}

.chats-page__session-status {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-weight: 600;
}

.chats-page__session-status--active {
  background: #dcfce7;
  color: #16a34a;
}

.chats-page__session-status--closed {
  background: #f1f5f9;
  color: #64748b;
}

/* Messages area */
.chats-page__messages {
  flex: 1;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chats-page__placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex: 1;
  color: var(--color-text-muted);
  font-size: 15px;
}

.chats-page__chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border-light);
}

.chats-page__chat-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chats-page__chat-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
}

.chats-page__chat-name {
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 15px;
  color: var(--color-text);
}

.chats-page__chat-subtitle {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-top: 2px;
}

.chats-page__chat-actions {
  display: flex;
  gap: 8px;
}

.chats-page__action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  font-family: var(--font-heading);
  font-weight: 500;
  font-size: 12px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.chats-page__action-btn--close:hover {
  border-color: var(--color-error);
  color: var(--color-error);
  background: #fef2f2;
}

/* Messages list */
.chats-page__messages-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #f8fafc;
}

.chats-page__msg {
  display: flex;
  max-width: 80%;
}

.chats-page__msg--user {
  align-self: flex-start;
}

.chats-page__msg--admin {
  align-self: flex-end;
}

.chats-page__msg-bubble {
  padding: 12px 16px;
  border-radius: var(--radius-md);
  font-size: 14px;
  line-height: 1.5;
}

.chats-page__msg--user .chats-page__msg-bubble {
  background: #fff;
  border: 1px solid var(--color-border);
  border-bottom-left-radius: 4px;
}

.chats-page__msg--admin .chats-page__msg-bubble {
  background: var(--color-primary);
  color: #fff;
  border-bottom-right-radius: 4px;
}

.chats-page__msg-bubble p {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

.chats-page__msg-attachment {
  margin-top: 8px;
}

.chats-page__msg-attachment img {
  max-width: 240px;
  border-radius: 8px;
  cursor: pointer;
}

.chats-page__msg-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  margin-top: 6px;
}

.chats-page__msg--user .chats-page__msg-meta {
  color: var(--color-text-muted);
}

.chats-page__msg--admin .chats-page__msg-meta {
  color: rgba(255, 255, 255, 0.7);
}

.chats-page__msg-status {
  opacity: 0.8;
}

/* Input area */
.chats-page__input-area {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid var(--color-border-light);
  background: #fff;
}

.chats-page__input {
  flex: 1;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 10px 14px;
  font-size: 14px;
  font-family: inherit;
  resize: none;
  outline: none;
  transition: border-color var(--transition-fast);
  line-height: 1.5;
  color: var(--color-text);
  background: var(--color-surface);
}

.chats-page__input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(232, 69, 69, 0.1);
}

.chats-page__send-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border-radius: var(--radius-md);
  background: var(--color-primary);
  color: #fff;
  border: none;
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.chats-page__send-btn:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

.chats-page__send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

@keyframes skeleton-shimmer {
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
}
</style>