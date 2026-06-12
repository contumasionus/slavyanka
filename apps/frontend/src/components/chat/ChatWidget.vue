<template>
  <div class="chat-widget">
    <!-- Кнопка открытия чата -->
    <button
      class="chat-widget__button"
      :class="{ 'chat-widget__button--has-unread': chatStore.unreadCount > 0 }"
      @click="handleToggle"
    >
      <svg v-if="!chatStore.isOpen" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <svg v-else width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
      <span v-if="chatStore.unreadCount > 0 && !chatStore.isOpen" class="chat-widget__badge">
        {{ chatStore.unreadCount > 9 ? '9+' : chatStore.unreadCount }}
      </span>
    </button>

    <!-- Окно чата -->
    <Transition name="chat-slide">
      <div v-if="chatStore.isOpen" class="chat-widget__window">
        <!-- Заголовок -->
        <div class="chat-widget__header">
          <div class="chat-widget__header-info">
            <div class="chat-widget__header-avatar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <div>
              <div class="chat-widget__header-title">Техническая поддержка</div>
              <div class="chat-widget__header-status">Онлайн</div>
            </div>
          </div>
          <button class="chat-widget__header-close" @click="chatStore.toggleChat()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <!-- Сообщения -->
        <div class="chat-widget__messages" ref="messagesContainer">
          <!-- Приветствие -->
          <div class="chat-widget__greeting">
            <div class="chat-widget__greeting-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <div class="chat-widget__greeting-text">Здравствуйте! Чем мы можем вам помочь?</div>
          </div>

          <!-- История сообщений -->
          <div
            v-for="msg in chatStore.messages"
            :key="msg.id"
            class="chat-widget__message"
            :class="{
              'chat-widget__message--user': msg.senderType === 'user',
              'chat-widget__message--admin': msg.senderType === 'admin',
              'chat-widget__message--temp': msg.id.startsWith('temp-'),
            }"
          >
            <div class="chat-widget__message-content">
              <p>{{ msg.content }}</p>
              <div v-if="msg.attachment" class="chat-widget__message-attachment">
                <img :src="msg.attachment" alt="Attachment" @click="previewImage(msg.attachment || '')" />
              </div>
              <div class="chat-widget__message-time">
                {{ formatTime(msg.createdAt) }}
                <span v-if="msg.senderType === 'user' && msg.isRead" class="chat-widget__message-read">✓✓</span>
              </div>
            </div>
          </div>

          <!-- Быстрые кнопки (показываются в начале ИЛИ после каждого ответа поддержки) -->
          <div v-if="chatStore.showQuickAnswers" class="chat-widget__quick-answers">
            <div class="chat-widget__quick-label">Частые вопросы:</div>
            <button
              v-for="qa in chatStore.quickAnswers"
              :key="qa.question"
              class="chat-widget__quick-btn"
              @click="handleQuickAnswer(qa.question, qa.answer)"
            >
              {{ qa.question }}
            </button>
          </div>

          <!-- Индикатор загрузки -->
          <div v-if="isSending" class="chat-widget__typing">
            <div class="chat-widget__typing-dot"></div>
            <div class="chat-widget__typing-dot"></div>
            <div class="chat-widget__typing-dot"></div>
          </div>
        </div>

        <!-- Поле ввода -->
        <div class="chat-widget__input-area">
          <button class="chat-widget__attach-btn" @click="triggerFileUpload" title="Прикрепить файл">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
          </button>
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            style="display:none"
            @change="handleFileUpload"
          />
          <input
            v-model="inputText"
            type="text"
            maxlength="1000"
            class="chat-widget__input"
            placeholder="Введите сообщение..."
            @keydown.enter.prevent="handleSend"
            :disabled="isSending"
          />
          <button
            class="chat-widget__send-btn"
            :disabled="!inputText.trim() || isSending"
            @click="handleSend"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useChatStore } from '../../stores/chat.store';
import { useAuthStore } from '../../stores/auth.store';
import { uploadApi } from '../../api/upload.api';
import { sanitizeInput, truncate } from '../../utils/validation';

const chatStore = useChatStore();
const authStore = useAuthStore();
const messagesContainer = ref<HTMLElement | null>(null);
const inputText = ref('');
const isSending = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const previewUrl = ref('');

// Следим за сменой пользователя — при login/logout пересоздаём сессию чата
watch(
  () => authStore.isAuthenticated,
  (isAuth) => {
    if (isAuth) {
      // Даём время authStore обновиться
      setTimeout(() => {
        chatStore.clearChat();
        chatStore.initSession();
      }, 100);
    }
  }
);

// Также следим за конкретным ID пользователя
watch(
  () => authStore.user?.id,
  (newId, oldId) => {
    if (newId !== oldId && oldId !== undefined) {
      setTimeout(() => {
        chatStore.clearChat();
        chatStore.initSession();
      }, 100);
    }
  }
);

// Скролл вниз при новых сообщениях
watch(() => chatStore.messages.length, async () => {
  await nextTick();
  scrollToBottom();
});

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
}

function handleToggle() {
  chatStore.toggleChat();
  if (chatStore.isOpen) {
    setTimeout(scrollToBottom, 100);
  }
}

async function handleSend() {
  const raw = inputText.value;
  const clean = sanitizeInput(truncate(raw, 1000));
  if (!clean || isSending.value) return;

  isSending.value = true;
  inputText.value = '';

  try {
    await chatStore.sendMessage(clean);
  } finally {
    isSending.value = false;
  }
}

async function handleQuickAnswer(question: string, answer: string) {
  isSending.value = true;

  // Показываем вопрос пользователя
  await chatStore.sendMessage(sanitizeInput(question));

  // Автоматический ответ через 1 секунду
  setTimeout(() => {
    chatStore.addAutoReply(answer);
    isSending.value = false;

    // Скролл вниз после ответа
    nextTick(() => scrollToBottom());
  }, 1000);
}

function triggerFileUpload() {
  fileInput.value?.click();
}

async function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  try {
    const result = await uploadApi.uploadFile(file);
    const url = result.url;

    isSending.value = true;
    await chatStore.sendMessage('📎 Отправил(а) файл', url);
  } catch (error) {
    console.error('Failed to upload file:', error);
  } finally {
    isSending.value = false;
    if (fileInput.value) fileInput.value.value = '';
  }
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function previewImage(url: string) {
  previewUrl.value = url;
  window.open(url, '_blank');
}
</script>

<style scoped>
.chat-widget {
  position: fixed;
  bottom: 80px;
  right: 24px;
  z-index: 9999;
  font-family: var(--font-body, 'Inter', sans-serif);
}

/* Кнопка */
.chat-widget__button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--color-primary, #e84545);
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(232, 69, 69, 0.35);
  transition: all var(--transition-normal, 0.25s);
  position: relative;
}

.chat-widget__button:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 28px rgba(232, 69, 69, 0.45);
}

.chat-widget__button--has-unread {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 4px 20px rgba(232, 69, 69, 0.35); }
  50% { box-shadow: 0 4px 30px rgba(232, 69, 69, 0.6); }
  100% { box-shadow: 0 4px 20px rgba(232, 69, 69, 0.35); }
}

.chat-widget__badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 22px;
  height: 22px;
  border-radius: 11px;
  background: var(--color-error, #ef4444);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
}

/* Окно чата */
.chat-widget__window {
  position: absolute;
  bottom: 72px;
  right: 0;
  width: 380px;
  height: 520px;
  background: #fff;
  border-radius: var(--radius-lg, 16px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Анимация */
.chat-slide-enter-active,
.chat-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.chat-slide-enter-from,
.chat-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.96);
}

/* Заголовок */
.chat-widget__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: var(--color-primary, #e84545);
  color: #fff;
}

.chat-widget__header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chat-widget__header-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-widget__header-title {
  font-family: var(--font-heading, 'Inter', sans-serif);
  font-weight: 600;
  font-size: 15px;
}

.chat-widget__header-status {
  font-size: 12px;
  opacity: 0.85;
}

.chat-widget__header-status::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4ade80;
  margin-right: 6px;
  vertical-align: middle;
}

.chat-widget__header-close {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  opacity: 0.8;
  padding: 4px;
  border-radius: 6px;
  transition: opacity var(--transition-fast, 0.15s);
}

.chat-widget__header-close:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.15);
}

/* Сообщения */
.chat-widget__messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #f8fafc;
}

.chat-widget__messages::-webkit-scrollbar {
  width: 4px;
}

.chat-widget__messages::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

/* Приветствие */
.chat-widget__greeting {
  text-align: center;
  padding: 20px 16px 12px;
}

.chat-widget__greeting-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--color-primary-soft, #ffeaea);
  color: var(--color-primary, #e84545);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
}

.chat-widget__greeting-text {
  font-size: 14px;
  color: var(--color-text-secondary, #64748b);
  line-height: 1.5;
}

/* Быстрые ответы */
.chat-widget__quick-answers {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px 8px 4px;
  margin-bottom: 8px;
}

.chat-widget__quick-label {
  font-size: 12px;
  color: var(--color-text-muted, #94a3b8);
  margin-bottom: 2px;
  font-weight: 500;
}

.chat-widget__quick-btn {
  padding: 10px 16px;
  border-radius: var(--radius-md, 12px);
  border: 1px solid var(--color-border, #e2e8f0);
  background: #fff;
  color: var(--color-text, #1a1a2e);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast, 0.15s);
  text-align: left;
}

.chat-widget__quick-btn:hover {
  border-color: var(--color-primary, #e84545);
  color: var(--color-primary, #e84545);
  background: var(--color-primary-soft, #ffeaea);
}

/* Сообщение */
.chat-widget__message {
  display: flex;
  max-width: 85%;
}

.chat-widget__message--user {
  align-self: flex-end;
}

.chat-widget__message--admin {
  align-self: flex-start;
}

.chat-widget__message--temp {
  opacity: 0.7;
}

.chat-widget__message-content {
  padding: 10px 14px;
  border-radius: var(--radius-md, 12px);
  font-size: 14px;
  line-height: 1.5;
  position: relative;
}

.chat-widget__message--user .chat-widget__message-content {
  background: var(--color-primary, #e84545);
  color: #fff;
  border-bottom-right-radius: 4px;
}

.chat-widget__message--admin .chat-widget__message-content {
  background: #fff;
  color: var(--color-text, #1a1a2e);
  border: 1px solid var(--color-border, #e2e8f0);
  border-bottom-left-radius: 4px;
}

.chat-widget__message-content p {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

.chat-widget__message-attachment {
  margin-top: 8px;
}

.chat-widget__message-attachment img {
  max-width: 200px;
  border-radius: 8px;
  cursor: pointer;
}

.chat-widget__message-time {
  font-size: 10px;
  margin-top: 4px;
  opacity: 0.7;
  display: flex;
  align-items: center;
  gap: 4px;
}

.chat-widget__message--user .chat-widget__message-time {
  text-align: right;
  color: rgba(255, 255, 255, 0.8);
}

.chat-widget__message--admin .chat-widget__message-time {
  color: var(--color-text-muted, #94a3b8);
}

.chat-widget__message-read {
  font-size: 10px;
  opacity: 0.8;
}

/* Индикатор печатания */
.chat-widget__typing {
  display: flex;
  gap: 4px;
  padding: 10px 14px;
  background: #fff;
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: var(--radius-md, 12px);
  align-self: flex-start;
  border-bottom-left-radius: 4px;
}

.chat-widget__typing-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-text-muted, #94a3b8);
  animation: typing 1.4s infinite;
}

.chat-widget__typing-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.chat-widget__typing-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

/* Поле ввода */
.chat-widget__input-area {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--color-border, #e2e8f0);
  background: #fff;
}

.chat-widget__attach-btn {
  background: none;
  border: none;
  color: var(--color-text-muted, #94a3b8);
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  transition: all var(--transition-fast, 0.15s);
  flex-shrink: 0;
}

.chat-widget__attach-btn:hover {
  color: var(--color-primary, #e84545);
  background: var(--color-primary-soft, #ffeaea);
}

.chat-widget__input {
  flex: 1;
  border: none;
  outline: none;
  padding: 8px 4px;
  font-size: 14px;
  color: var(--color-text, #1a1a2e);
  background: transparent;
  font-family: inherit;
}

.chat-widget__input::placeholder {
  color: var(--color-text-muted, #94a3b8);
}

.chat-widget__send-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-primary, #e84545);
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast, 0.15s);
  flex-shrink: 0;
}

.chat-widget__send-btn:hover:not(:disabled) {
  background: var(--color-primary-dark, #c0392b);
  transform: scale(1.05);
}

.chat-widget__send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

@media (max-width: 480px) {
  .chat-widget {
    bottom: 80px;
    right: 16px;
  }

  .chat-widget__window {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    border-radius: 0;
    bottom: 0;
  }
}
</style>