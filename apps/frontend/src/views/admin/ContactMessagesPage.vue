<template>
  <div class="messages-page">
    <div class="messages-page__header">
      <h1 class="messages-page__title">Отзывы и обращения</h1>
      <button class="messages-page__refresh" @click="loadMessages">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
        Обновить
      </button>
    </div>

    <div v-if="loading" class="messages-page__loading">
      <div v-for="n in 3" :key="n" class="messages-page__skeleton"></div>
    </div>

    <div v-else-if="messages.length === 0" class="messages-page__empty">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      <p>Пока нет отзывов и обращений</p>
    </div>

    <div v-else class="messages-page__list">
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="messages-page__card"
        :class="{ 'messages-page__card--unread': !msg.isRead, 'messages-page__card--replied': msg.adminReply }"
      >
        <div class="messages-page__card-header">
          <div class="messages-page__card-user">
            <div class="messages-page__card-avatar">{{ msg.name.charAt(0).toUpperCase() }}</div>
            <div>
              <div class="messages-page__card-name">{{ msg.name }}</div>
              <div class="messages-page__card-email">{{ msg.email }}</div>
            </div>
          </div>
          <div class="messages-page__card-meta">
            <span class="messages-page__card-topic">{{ topicLabel(msg.topic) }}</span>
            <span class="messages-page__card-date">{{ formatDate(msg.createdAt) }}</span>
          </div>
        </div>

        <div class="messages-page__card-message">
          <p>{{ msg.message }}</p>
          <span v-if="msg.phone" class="messages-page__card-phone">📞 {{ msg.phone }}</span>
        </div>

        <!-- Ответ админа -->
        <div v-if="msg.adminReply" class="messages-page__card-reply">
          <div class="messages-page__card-reply-label">Ваш ответ:</div>
          <p>{{ msg.adminReply }}</p>
          <div class="messages-page__card-reply-date">{{ formatDate(msg.repliedAt || '') }}</div>
        </div>

        <!-- Кнопка ответа -->
        <button
          v-if="!msg.adminReply"
          class="messages-page__reply-btn"
          @click="openReply(msg)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          Ответить
        </button>
      </div>
    </div>

    <!-- Модальное окно ответа -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="replyTarget" class="modal-overlay" @click.self="replyTarget = null">
          <div class="modal-card" @click.stop>
            <button class="modal-close" @click="replyTarget = null" aria-label="Закрыть">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
            <div class="modal-body">
              <h2 class="modal-title">Ответить {{ replyTarget.name }}</h2>
              <div class="modal-message">
                <p><strong>Тема:</strong> {{ topicLabel(replyTarget.topic) }}</p>
                <p><strong>Сообщение:</strong></p>
                <p style="background:#f5f5f5;padding:12px;border-radius:8px;">{{ replyTarget.message }}</p>
              </div>
              <div class="modal-field">
                <textarea
                  v-model="replyText"
                  class="modal-textarea"
                  placeholder="Введите ответ..."
                  rows="5"
                  maxlength="2000"
                ></textarea>
              </div>
              <div class="modal-actions">
                <button class="btn btn--outline" @click="replyTarget = null">Отмена</button>
                <button class="btn btn--primary" :disabled="!replyText.trim() || isSending" @click="handleReply">
                  {{ isSending ? 'Отправка...' : 'Отправить ответ' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { contactMessagesApi, ContactMessage } from '../../api/contact-messages.api';

const messages = ref<ContactMessage[]>([]);
const loading = ref(true);
const isSending = ref(false);
const replyTarget = ref<ContactMessage | null>(null);
const replyText = ref('');

onMounted(() => {
  loadMessages();
});

function topicLabel(topic: string): string {
  const map: Record<string, string> = {
    feedback: 'Отзыв о магазине',
    question: 'Вопрос по товару',
    complaint: 'Жалоба / предложение',
    delivery: 'Вопрос по доставке',
    other: 'Другое',
  };
  return map[topic] || topic || 'Без темы';
}

async function loadMessages() {
  loading.value = true;
  try {
    messages.value = await contactMessagesApi.getAll();
  } catch (error) {
    console.error('Failed to load messages:', error);
  } finally {
    loading.value = false;
  }
}

function openReply(msg: ContactMessage) {
  replyTarget.value = msg;
  replyText.value = '';
}

async function handleReply() {
  if (!replyTarget.value || !replyText.value.trim() || isSending.value) return;

  isSending.value = true;
  try {
    const updated = await contactMessagesApi.reply(replyTarget.value.id, replyText.value.trim());
    const index = messages.value.findIndex(m => m.id === updated.id);
    if (index !== -1) {
      messages.value[index] = updated;
    }
    replyTarget.value = null;
    replyText.value = '';
  } catch (error) {
    console.error('Failed to reply:', error);
  } finally {
    isSending.value = false;
  }
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
</script>

<style scoped>
.messages-page {
  padding: 24px;
}
.messages-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.messages-page__title {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 24px;
  color: var(--color-text);
}
.messages-page__refresh {
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
.messages-page__refresh:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
.messages-page__loading {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.messages-page__skeleton {
  height: 120px;
  background: var(--color-border-light);
  border-radius: var(--radius-lg);
  animation: shimmer 1.8s ease-in-out infinite;
}
@keyframes shimmer {
  0% { opacity: 0.4; }
  50% { opacity: 1; }
  100% { opacity: 0.4; }
}
.messages-page__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 60px 20px;
  color: var(--color-text-muted);
  font-size: 15px;
}
.messages-page__list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.messages-page__card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
  padding: 20px;
  transition: all var(--transition-fast);
}
.messages-page__card--unread {
  border-left: 3px solid var(--color-primary);
  background: var(--color-primary-soft);
}
.messages-page__card--replied {
  border-left: 3px solid var(--color-success);
}
.messages-page__card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 12px;
}
.messages-page__card-user {
  display: flex;
  align-items: center;
  gap: 12px;
}
.messages-page__card-avatar {
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
  flex-shrink: 0;
}
.messages-page__card-name {
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 15px;
  color: var(--color-text);
}
.messages-page__card-email {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-top: 2px;
}
.messages-page__card-meta {
  text-align: right;
  flex-shrink: 0;
}
.messages-page__card-topic {
  display: inline-block;
  padding: 2px 10px;
  border-radius: var(--radius-full);
  background: rgba(211,84,0,0.08);
  color: var(--color-primary);
  font-size: 11px;
  font-weight: 600;
}
.messages-page__card-date {
  display: block;
  font-size: 11px;
  color: var(--color-text-muted);
  margin-top: 4px;
}
.messages-page__card-message {
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
}
.messages-page__card-message p {
  margin: 0 0 8px;
  white-space: pre-wrap;
}
.messages-page__card-phone {
  font-size: 13px;
  color: var(--color-text-muted);
}
.messages-page__card-reply {
  background: #f0fdf4;
  border-radius: var(--radius-md);
  padding: 12px 16px;
  margin-top: 12px;
  border: 1px solid #bbf7d0;
}
.messages-page__card-reply-label {
  font-size: 12px;
  font-weight: 600;
  color: #16a34a;
  margin-bottom: 4px;
}
.messages-page__card-reply p {
  font-size: 14px;
  margin: 0 0 4px;
  white-space: pre-wrap;
  color: var(--color-text);
}
.messages-page__card-reply-date {
  font-size: 11px;
  color: var(--color-text-muted);
}
.messages-page__reply-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
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
.messages-page__reply-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-primary-soft);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,0.6);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  padding: 20px;
}
.modal-card {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: 40px 32px 32px;
  width: 100%;
  max-width: 540px;
  position: relative;
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--color-border);
}
.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: var(--color-border-light);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-text-muted);
  transition: all var(--transition-fast);
}
.modal-close:hover {
  background: var(--color-error);
  color: #fff;
  transform: scale(1.1);
}
.modal-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.modal-title {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 22px;
  color: var(--color-text);
}
.modal-message {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.6;
}
.modal-message p {
  margin: 0 0 8px;
}
.modal-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.modal-textarea {
  width: 100%;
  padding: 14px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--color-text);
  resize: vertical;
  min-height: 120px;
  outline: none;
  box-sizing: border-box;
  transition: border-color var(--transition-fast);
}
.modal-textarea:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(211,84,0,0.08);
}
.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 12px 24px;
  border-radius: var(--radius-full);
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  border: none;
  transition: all var(--transition-bounce);
  text-decoration: none;
}
.btn--primary {
  background: var(--color-primary);
  color: #fff;
}
.btn--primary:hover:not(:disabled) {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(232,69,69,0.25);
}
.btn--primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn--outline {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
}
.btn--outline:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
.modal-enter-active, .modal-leave-active { transition: opacity 0.25s ease; }
.modal-enter-active .modal-card, .modal-leave-active .modal-card { transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1); }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal-card { transform: scale(0.9) translateY(20px); }
.modal-leave-to .modal-card { transform: scale(0.9) translateY(20px); }
</style>