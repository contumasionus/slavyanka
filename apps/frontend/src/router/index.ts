import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import HomePage from '../views/HomePage.vue';
import CatalogPage from '../views/CatalogPage.vue';
import AboutPage from '../views/AboutPage.vue';
import ContactsPage from '../views/ContactsPage.vue';
import CartPage from '../views/CartPage.vue';
import PromoPage from '../views/PromoPage.vue';
import NewsPage from '../views/NewsPage.vue';
import NewsArticlePage from '../views/NewsArticlePage.vue';
import PrivacyPage from '../views/PrivacyPage.vue';
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
import ChatsPage from '../views/admin/ChatsPage.vue';
import AdminNewsPage from '../views/admin/AdminNewsPage.vue';
import ContactMessagesPage from '../views/admin/ContactMessagesPage.vue';

interface RouteMeta {
  title?: string;
  description?: string;
  requiresAuth?: boolean;
}

const routes = [
  { path: '/', component: HomePage, meta: { title: 'Славянка — Продуктовый магазин в деревне Курилово', description: 'Свежие продукты каждый день в деревне Курилово. Широкий ассортимент, ежедневные поставки, доставка. Работаем с 8:00 до 22:00.' } },
  { path: '/catalog', component: CatalogPage, meta: { title: 'Каталог товаров — Славянка', description: 'Каталог продуктов и товаров для дома в магазине Славянка. Выпечка, молочка, овощи, фрукты, бакалея и многое другое.' } },
  { path: '/promo', component: PromoPage, meta: { title: 'Акции и скидки — Славянка', description: 'Текущие акции и специальные предложения в продуктовом магазине Славянка. Успейте купить со скидкой!' } },
  { path: '/news', component: NewsPage, meta: { title: 'Новости — Славянка', description: 'Новости магазина Славянка: новые поступления, изменения в графике работы, специальные предложения.' } },
  { path: '/news/:slug', component: NewsArticlePage, meta: { title: 'Новости — Славянка' } },
  { path: '/about', component: AboutPage, meta: { title: 'О магазине — Славянка', description: 'Узнайте больше о продуктовом магазине Славянка в деревне Курилово. Наша история, ценности и преимущества.' } },
  { path: '/contacts', component: ContactsPage, meta: { title: 'Контакты — Славянка', description: 'Контакты магазина Славянка: адрес, телефон, режим работы, форма обратной связи.' } },
  { path: '/cart', component: CartPage, meta: { title: 'Корзина — Славянка' } },
  { path: '/privacy', component: PrivacyPage, meta: { title: 'Политика конфиденциальности — Славянка' } },
  { path: '/login', component: LoginPage, meta: { title: 'Вход — Славянка' } },
  { path: '/register', component: RegisterPage, meta: { title: 'Регистрация — Славянка' } },
  { path: '/profile', component: ProfilePage, meta: { title: 'Профиль — Славянка', requiresAuth: true } },
  // Админка
  { path: '/admin/login', component: AdminLoginPage, meta: { title: 'Вход в панель управления — Славянка' } },
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: 'dashboard', component: DashboardPage, meta: { title: 'Панель управления — Славянка' } },
      { path: 'products', component: ProductsPage, meta: { title: 'Управление товарами — Славянка' } },
      { path: 'categories', component: CategoriesPage, meta: { title: 'Категории — Славянка' } },
      { path: 'orders', component: OrdersPage, meta: { title: 'Заказы — Славянка' } },
      { path: 'users', component: UsersPage, meta: { title: 'Пользователи — Славянка' } },
      { path: 'chats', component: ChatsPage, meta: { title: 'Чаты — Славянка' } },
      { path: 'news', component: AdminNewsPage, meta: { title: 'Новости — Славянка' } },
      { path: 'messages', component: ContactMessagesPage, meta: { title: 'Сообщения — Славянка' } },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' };
  },
});

// Навигационный guard — обновление title и description
router.beforeEach((to, _from, next) => {
  const meta = to.meta as RouteMeta | undefined;
  if (meta?.title) {
    document.title = meta.title;
  }
  if (meta?.description) {
    let descEl = document.querySelector('meta[name="description"]');
    if (!descEl) {
      descEl = document.createElement('meta');
      descEl.setAttribute('name', 'description');
      document.head.appendChild(descEl);
    }
    descEl.setAttribute('content', meta.description);
  }
  next();
});

// Навигационный guard — проверка авторизации
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
    return;
  }

  if (to.path.startsWith('/admin') && to.path !== '/admin/login') {
    if (!authStore.isAuthenticated) {
      next('/admin/login');
      return;
    }
    if (!authStore.user) {
      try {
        await authStore.fetchUser();
      } catch {
        next('/admin/login');
        return;
      }
    }
    if (!authStore.isAdmin) {
      next('/');
      return;
    }
  }

  next();
});

export default router;