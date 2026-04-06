<template>
  <div class="profile-page">
    <div class="profile-container">
      <div class="profile-header">
        <h1 class="profile-title">Личный кабинет</h1>
        <p class="profile-subtitle">Управляйте своим аккаунтом и настройками</p>
      </div>

      <div v-if="loading" class="loading-state">
        Загрузка профиля...
      </div>

      <div v-else-if="error" class="error-state">
        {{ error }}
      </div>

      <div v-else class="profile-content">
        <!-- User Info Section -->
        <div class="profile-section">
          <h2 class="section-title">Информация о пользователе</h2>
          <div class="user-info-card">
            <div class="user-avatar">
              <span class="avatar-text">{{ user?.name?.charAt(0)?.toUpperCase() || 'U' }}</span>
            </div>
            <div class="user-details">
              <div class="detail-row">
                <span class="detail-label">Имя:</span>
                <span class="detail-value">{{ user?.name }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">{{ user?.email }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Дата регистрации:</span>
                <span class="detail-value">{{ formatDate(user?.createdAt) }}</span>
              </div>
            </div>
            <button @click="showEditModal = true" class="edit-button">
              Редактировать
            </button>
          </div>
        </div>

        <!-- Visit Statistics Section -->
        <div class="profile-section">
          <h2 class="section-title">Статистика посещений</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">📊</div>
              <div class="stat-info">
                <span class="stat-value">{{ visitStats?.totalVisits || 0 }}</span>
                <span class="stat-label">Всего посещений</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📅</div>
              <div class="stat-info">
                <span class="stat-value">{{ visitStats?.weeklyVisits || 0 }}</span>
                <span class="stat-label">За неделю</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🗓️</div>
              <div class="stat-info">
                <span class="stat-value">{{ visitStats?.monthlyVisits || 0 }}</span>
                <span class="stat-label">За месяц</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Notifications Section -->
        <div class="profile-section">
          <h2 class="section-title">Мои уведомления</h2>
          <div v-if="notifications.length === 0" class="empty-state">
            <div class="empty-icon">🔔</div>
            <p>У вас пока нет уведомлений</p>
            <router-link to="/catalog" class="browse-link">Перейти в каталог</router-link>
          </div>
          <div v-else class="notifications-list">
            <div 
              v-for="notification in notifications" 
              :key="notification.id" 
              class="notification-item"
            >
              <div class="notification-icon">📦</div>
              <div class="notification-content">
                <h4 class="notification-title">{{ notification.product?.name }}</h4>
                <p class="notification-date">Подписка: {{ formatDate(notification.createdAt) }}</p>
              </div>
              <button 
                @click="unsubscribeFromProduct(notification.productId)" 
                class="unsubscribe-button"
              >
                Отписаться
              </button>
            </div>
          </div>
        </div>

        <!-- Notification Stats Section -->
        <div class="profile-section">
          <h2 class="section-title">Статистика уведомлений</h2>
          <div class="notification-stats">
            <div class="stat-item">
              <span class="stat-number">{{ notificationStats?.totalNotifications || 0 }}</span>
              <span class="stat-desc">Всего подписок</span>
            </div>
            <div v-if="notificationStats?.topProducts?.length" class="top-products">
              <h4 class="top-title">Частые товары:</h4>
              <div 
                v-for="product in notificationStats.topProducts" 
                :key="product.productId" 
                class="top-product"
              >
                <span class="product-name">{{ product.productName }}</span>
                <span class="product-count">{{ product.notificationCount }} раз</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Admin Panel Button (only for admins) -->
        <div v-if="isAdmin" class="profile-section">
          <router-link to="/admin/products" class="admin-button">
            Панель администратора
          </router-link>
        </div>

        <!-- Logout Button -->
        <div class="profile-section">
          <button @click="handleLogout" class="logout-button">
            Выйти из аккаунта
          </button>
        </div>
      </div>

      <!-- Edit Profile Modal -->
      <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
        <div class="modal-content">
          <h3 class="modal-title">Редактировать профиль</h3>
          <form @submit.prevent="updateProfile" class="edit-form">
            <div class="form-group">
              <label for="editName" class="form-label">Имя</label>
              <input
                id="editName"
                v-model="editForm.name"
                type="text"
                class="form-input"
                required
              />
            </div>
            <div class="form-group">
              <label for="editEmail" class="form-label">Email</label>
              <input
                id="editEmail"
                v-model="editForm.email"
                type="email"
                class="form-input"
                required
              />
            </div>
            <div class="modal-actions">
              <button type="button" @click="showEditModal = false" class="cancel-button">
                Отмена
              </button>
              <button type="submit" class="save-button" :disabled="updating">
                {{ updating ? 'Сохранение...' : 'Сохранить' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import { usersApi } from '../api/users.api';
import { notificationsApi } from '../api/notifications.api';
import { visitsApi } from '../api/visits.api';

const router = useRouter();
const authStore = useAuthStore();

const isAdmin = computed(() => authStore.isAdmin);

const user = ref<any>(null);
const visitStats = ref<any>(null);
const notifications = ref<any[]>([]);
const notificationStats = ref<any>(null);
const loading = ref(true);
const error = ref('');
const showEditModal = ref(false);
const updating = ref(false);

const editForm = ref({
  name: '',
  email: '',
});

onMounted(async () => {
  await loadProfileData();
  // Track visit
  try {
    await visitsApi.track();
  } catch (e) {
    console.error('Failed to track visit:', e);
  }
});

async function loadProfileData() {
  loading.value = true;
  error.value = '';

  try {
    const [profileData, visitData, notificationsData, statsData] = await Promise.all([
      usersApi.getProfile(),
      visitsApi.getStats(),
      notificationsApi.getMyNotifications(),
      notificationsApi.getStats(),
    ]);

    user.value = profileData;
    visitStats.value = visitData;
    notifications.value = notificationsData;
    notificationStats.value = statsData;

    editForm.value.name = profileData.name;
    editForm.value.email = profileData.email;
  } catch (e: any) {
    error.value = e.response?.data?.error || 'Ошибка загрузки профиля';
  } finally {
    loading.value = false;
  }
}

async function updateProfile() {
  updating.value = true;

  try {
    await usersApi.updateProfile(editForm.value);
    user.value.name = editForm.value.name;
    user.value.email = editForm.value.email;
    showEditModal.value = false;
  } catch (e: any) {
    error.value = e.response?.data?.error || 'Ошибка обновления профиля';
  } finally {
    updating.value = false;
  }
}

async function unsubscribeFromProduct(productId: string) {
  try {
    await notificationsApi.unsubscribe(productId);
    notifications.value = notifications.value.filter(n => n.productId !== productId);
    notificationStats.value.totalNotifications--;
  } catch (e: any) {
    error.value = e.response?.data?.error || 'Ошибка отписки';
  }
}

function handleLogout() {
  authStore.logout();
  router.push('/');
}

function formatDate(dateString: string) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background-color: var(--color-background);
  padding: 40px 20px;
}

.profile-container {
  max-width: 800px;
  margin: 0 auto;
}

.profile-header {
  text-align: center;
  margin-bottom: 40px;
}

.profile-title {
  font-family: var(--font-inter);
  font-weight: 700;
  font-size: 36px;
  color: var(--color-primary);
  margin-bottom: 10px;
}

.profile-subtitle {
  font-family: var(--font-inter);
  font-size: 16px;
  color: var(--color-text-light);
}

.loading-state,
.error-state {
  text-align: center;
  padding: 40px;
  font-family: var(--font-inter);
  font-size: 18px;
  color: var(--color-text-light);
}

.error-state {
  color: #e74c3c;
}

.profile-section {
  background-color: var(--color-white);
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-family: var(--font-inter);
  font-weight: 600;
  font-size: 20px;
  color: var(--color-text);
  margin-bottom: 20px;
}

.user-info-card {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-text {
  font-family: var(--font-inter);
  font-weight: 700;
  font-size: 32px;
  color: var(--color-white);
}

.user-details {
  flex: 1;
  min-width: 200px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-family: var(--font-inter);
}

.detail-label {
  font-weight: 500;
  color: var(--color-text-light);
}

.detail-value {
  font-weight: 600;
  color: var(--color-text);
}

.edit-button {
  background-color: var(--color-primary);
  color: var(--color-white);
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-family: var(--font-inter);
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.3s;
}

.edit-button:hover {
  opacity: 0.9;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 12px;
}

.stat-icon {
  font-size: 32px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-family: var(--font-inter);
  font-weight: 700;
  font-size: 24px;
  color: var(--color-primary);
}

.stat-label {
  font-family: var(--font-inter);
  font-size: 14px;
  color: var(--color-text-light);
}

.empty-state {
  text-align: center;
  padding: 40px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.empty-state p {
  font-family: var(--font-inter);
  font-size: 16px;
  color: var(--color-text-light);
  margin-bottom: 20px;
}

.browse-link {
  color: var(--color-primary);
  text-decoration: none;
  font-family: var(--font-inter);
  font-weight: 500;
}

.browse-link:hover {
  text-decoration: underline;
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.notification-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 12px;
}

.notification-icon {
  font-size: 24px;
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-family: var(--font-inter);
  font-weight: 600;
  font-size: 16px;
  color: var(--color-text);
  margin-bottom: 5px;
}

.notification-date {
  font-family: var(--font-inter);
  font-size: 14px;
  color: var(--color-text-light);
}

.unsubscribe-button {
  background-color: #e74c3c;
  color: var(--color-white);
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-family: var(--font-inter);
  font-size: 14px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.unsubscribe-button:hover {
  opacity: 0.9;
}

.notification-stats {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-number {
  font-family: var(--font-inter);
  font-weight: 700;
  font-size: 32px;
  color: var(--color-primary);
}

.stat-desc {
  font-family: var(--font-inter);
  font-size: 16px;
  color: var(--color-text-light);
}

.top-products {
  margin-top: 10px;
}

.top-title {
  font-family: var(--font-inter);
  font-weight: 600;
  font-size: 16px;
  color: var(--color-text);
  margin-bottom: 10px;
}

.top-product {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  font-family: var(--font-inter);
}

.product-name {
  color: var(--color-text);
}

.product-count {
  color: var(--color-primary);
  font-weight: 500;
}

.logout-button {
  width: 100%;
  background-color: #e74c3c;
  color: var(--color-white);
  border: none;
  border-radius: 8px;
  padding: 14px;
  font-family: var(--font-inter);
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.logout-button:hover {
  opacity: 0.9;
}

.admin-button {
  display: block;
  width: 100%;
  background-color: var(--color-primary);
  color: var(--color-white);
  border: none;
  border-radius: 8px;
  padding: 14px;
  font-family: var(--font-inter);
  font-weight: 600;
  font-size: 16px;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.3s;
}

.admin-button:hover {
  opacity: 0.9;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background-color: var(--color-white);
  border-radius: 16px;
  padding: 30px;
  width: 100%;
  max-width: 400px;
}

.modal-title {
  font-family: var(--font-inter);
  font-weight: 700;
  font-size: 24px;
  color: var(--color-text);
  margin-bottom: 20px;
  text-align: center;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-family: var(--font-inter);
  font-weight: 500;
  font-size: 14px;
  color: var(--color-text);
}

.form-input {
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: var(--font-inter);
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.modal-actions {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

.cancel-button {
  flex: 1;
  background-color: #95a5a6;
  color: var(--color-white);
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-family: var(--font-inter);
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.3s;
}

.cancel-button:hover {
  opacity: 0.9;
}

.save-button {
  flex: 1;
  background-color: var(--color-primary);
  color: var(--color-white);
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-family: var(--font-inter);
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.3s;
}

.save-button:hover:not(:disabled) {
  opacity: 0.9;
}

.save-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .profile-page {
    padding: 20px 15px;
  }
  
  .profile-title {
    font-size: 28px;
  }
  
  .profile-section {
    padding: 20px;
  }
  
  .user-info-card {
    flex-direction: column;
    text-align: center;
  }
  
  .user-details {
    width: 100%;
  }
  
  .detail-row {
    flex-direction: column;
    gap: 5px;
    text-align: center;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .notification-item {
    flex-direction: column;
    text-align: center;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
</style>