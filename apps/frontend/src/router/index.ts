import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import HomePage from '../views/HomePage.vue';
import AboutPage from '../views/AboutPage.vue';
import ContactsPage from '../views/ContactsPage.vue';
import CatalogPage from '../views/CatalogPage.vue';
import LoginPage from '../views/LoginPage.vue';
import RegisterPage from '../views/RegisterPage.vue';
import ProfilePage from '../views/ProfilePage.vue';
import AdminLoginPage from '../views/admin/LoginPage.vue';
import AdminLayout from '../views/admin/AdminLayout.vue';
import DashboardPage from '../views/admin/DashboardPage.vue';
import ProductsPage from '../views/admin/ProductsPage.vue';
import CategoriesPage from '../views/admin/CategoriesPage.vue';
import OrdersPage from '../views/admin/OrdersPage.vue';
import UsersPage from '../views/admin/UsersPage.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/about', component: AboutPage },
  { path: '/contacts', component: ContactsPage },
  { path: '/catalog', component: CatalogPage },
  { path: '/catalog/:categoryId', component: CatalogPage },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/profile', component: ProfilePage, meta: { requiresAuth: true } },
  { path: '/admin/login', component: AdminLoginPage },
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: 'dashboard', component: DashboardPage },
      { path: 'products', component: ProductsPage },
      { path: 'categories', component: CategoriesPage },
      { path: 'orders', component: OrdersPage },
      { path: 'users', component: UsersPage },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Навигационный guard для защиты админ маршрутов
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  // Проверяем требуется ли авторизация
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
    return;
  }
  
  // Проверяем требуется ли роль админа
  if (to.path.startsWith('/admin') && to.path !== '/admin/login') {
    if (!authStore.isAuthenticated) {
      next('/admin/login');
      return;
    }
    
    // Загружаем данные пользователя если еще не загружены
    if (!authStore.user) {
      try {
        await authStore.fetchUser();
      } catch {
        next('/admin/login');
        return;
      }
    }
    
    // Проверяем роль админа
    if (!authStore.isAdmin) {
      next('/');
      return;
    }
  }
  
  next();
});

export default router;
