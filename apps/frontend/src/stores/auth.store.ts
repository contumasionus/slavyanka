import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authApi } from '../api/auth.api';
import { resetCart, setCartUserId } from './cart.store';
import { resetFavorites, setFavoritesUserId } from './favorites.store';

function getLocalStorageItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    console.error('localStorage недоступен:', key);
    return null;
  }
}

function setLocalStorageItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error('localStorage не доступен:', error);
  }
}

function removeLocalStorageItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('localStorage не доступен:', error);
  }
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(getLocalStorageItem('token'));
  const user = ref<any>(null);

  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === 'admin');

  async function login(email: string, password: string) {
    const response = await authApi.login(email, password);
    token.value = response.token;
    user.value = response.user;
    setLocalStorageItem('token', response.token);
    // Переключаем корзину и избранное на этого пользователя
    setCartUserId(response.user.id);
    setFavoritesUserId(response.user.id);
  }

  async function register(email: string, password: string, name: string) {
    const response = await authApi.register(email, password, name);
    token.value = response.token;
    user.value = response.user;
    setLocalStorageItem('token', response.token);
    // Переключаем корзину и избранное на этого пользователя
    setCartUserId(response.user.id);
    setFavoritesUserId(response.user.id);
  }

  async function fetchUser() {
    if (!token.value) return;
    try {
      user.value = await authApi.getMe();
      // Переключаем корзину и избранное на этого пользователя
      setCartUserId(user.value.id);
      setFavoritesUserId(user.value.id);
    } catch (error) {
      console.error('Ошибка загрузки пользователя:', error);
      logout();
    }
  }

  function logout() {
    token.value = null;
    user.value = null;
    removeLocalStorageItem('token');

    // Очистить все данные чата — чтобы следующий пользователь не видел чужую переписку
    const chatKeys = ['chat-session-id', 'chat-guest-id', 'chat-messages', 'chat-user-hash'];
    chatKeys.forEach(key => removeLocalStorageItem(key));

    // Очистить корзину, избранное в памяти
    resetCart();
    resetFavorites();

    // Переключить на гостевые ключи
    setCartUserId(null);
    setFavoritesUserId(null);
  }

  return { token, user, isAuthenticated, isAdmin, login, register, fetchUser, logout };
});