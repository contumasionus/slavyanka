import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authApi } from '../api/auth.api';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'));
  const user = ref<any>(null);

  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === 'admin');

  async function login(email: string, password: string) {
    const response = await authApi.login(email, password);
    token.value = response.token;
    user.value = response.user;
    localStorage.setItem('token', response.token);
  }

  async function register(email: string, password: string, name: string) {
    const response = await authApi.register(email, password, name);
    token.value = response.token;
    user.value = response.user;
    localStorage.setItem('token', response.token);
  }

  async function fetchUser() {
    if (!token.value) return;
    try {
      user.value = await authApi.getMe();
    } catch {
      logout();
    }
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
  }

  return { token, user, isAuthenticated, isAdmin, login, register, fetchUser, logout };
});