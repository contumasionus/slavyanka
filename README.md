# 🏪 Славянка — Магазин продуктов

Веб-приложение для онлайн-магазина продуктов «Славянка».  
Разработано на **Fastify** (бэкенд) + **Vue 3** (фронтенд) + **Prisma** (БД).

---

## 🚀 Быстрый старт (с флешки / с любого ПК)

```bash
# 1. Установка зависимостей
npm install

# 2. Настройка базы данных
cd apps/backend
npm run setup

# 3. Запуск бэкенда (порт 3001)
npm run dev

# 4. В отдельном терминале — запуск фронтенда (порт 3000)
cd ../frontend
npm run dev
```

Готово! Открой http://localhost:3000

---

## 📧 Подтверждение почты при регистрации

При регистрации на сайте приходит **код подтверждения на email**.  
Работает **из коробки** — ничего настраивать не нужно.

Отправка идёт через облачный сервис **EmailJS** (ключи уже вшиты).

### Если хочешь сменить почту для отправки:

1. Зарегистрируйся на [emailjs.com](https://www.emailjs.com)
2. Создай сервис (Gmail/Mail.ru) → получи Service ID
3. Создай шаблон с полем `{{verification_code}}` и `{{to_email}}` → получи Template ID
4. Получи Public Key и Private Key в Account → API Keys
5. Пропиши их в `apps/backend/.env`:

```env
EMAILJS_SERVICE_ID=service_xxxxxxxx
EMAILJS_TEMPLATE_ID=template_xxxxxxxx
EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxx
EMAILJS_PRIVATE_KEY=xxxxxxxxxxxxx
```

6. Включи **"Allow API for non-browser applications"** в Account → Security

---

## 🔑 Данные для входа

| Роль | Email | Пароль |
|------|-------|--------|
| Администратор | `admin@slavyanka.ru` | `admin123` |

---

## 📦 Структура проекта

```
slavyanka-store/
├── apps/
│   ├── backend/          # Fastify + Prisma API
│   │   ├── prisma/       # Схема БД, миграции, seed
│   │   ├── src/
│   │   │   ├── controllers/  # Обработчики запросов
│   │   │   ├── routes/       # Роуты (auth, products, orders, ...)
│   │   │   ├── services/     # Бизнес-логика
│   │   │   ├── middleware/   # JWT, проверка ролей
│   │   │   ├── utils/        # Хэлперы (hash, ...)
│   │   │   ├── db.ts         # Единый инстанс Prisma
│   │   │   └── server.ts     # Точка входа
│   │   └── .env.example      # Пример конфига
│   └── frontend/         # Vue 3 + Vite
│       ├── src/
│       │   ├── components/   # Vue-компоненты
│       │   ├── views/        # Страницы
│       │   ├── stores/       # Pinia-хранилища
│       │   ├── api/          # API-клиенты
│       │   ├── router/       # Маршруты
│       │   └── styles/       # Глобальные стили
│       └── public/
└── packages/
    └── shared-types/    # Общие TypeScript-типы
```

---

## 🛠️ Команды

### Бэкенд
| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск в режиме разработки |
| `npm run build` | Компиляция TypeScript |
| `npm run start` | Запуск собранного приложения |
| `npm run setup` | Инициализация БД (generate + seed) |
| `npm run db:seed` | Заполнение тестовыми данными |
| `npm run db:studio` | Prisma Studio (веб-интерфейс БД) |

### Фронтенд
| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск в режиме разработки |
| `npm run build` | Сборка для продакшена |
| `npm run preview` | Превью собранного приложения |

---

## 🌐 API

- **Swagger docs:** `http://localhost:3001/docs`
- **Health check:** `http://localhost:3001/health`
- **WebSocket-чат:** `ws://localhost:3001/api/chat/ws`

### Основные эндпоинты:
| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/api/auth/login` | Вход |
| POST | `/api/auth/register` | Регистрация |
| POST | `/api/auth/send-verification` | Отправить код на почту |
| POST | `/api/auth/verify-code` | Проверить код |
| GET | `/api/products` | Список товаров |
| GET | `/api/products/:id` | Товар по ID |
| GET | `/api/categories` | Список категорий |

---

## ⚙️ Переменные окружения

Скопируйте `apps/backend/.env.example` в `apps/backend/.env` (уже есть в проекте):

```env
DATABASE_URL=file:./dev.db
JWT_SECRET=slavyanka-super-secret-key-2026
PORT=3001
HOST=0.0.0.0
# EmailJS опционально — уже настроено
EMAILJS_SERVICE_ID=
EMAILJS_TEMPLATE_ID=
EMAILJS_PUBLIC_KEY=
EMAILJS_PRIVATE_KEY=
```

---

## 🖼️ Изображения товаров

Все изображения товаров хранятся в папке `apps/frontend/public/products/` под именем `product-{id}.{ext}`. В базе данных в поле `imageUrl` хранится только относительный путь вида `/products/product-{id}.png`.

### Как это работает
- **Seed-товары** — используют `/images/products/...` (лежат в `public/images/products/`)
- **Загруженные через админку** — конвертируются и сохраняются в `public/products/`
- **Экспорт** — скрипт `scripts/export-images.ts` проходит по всем товарам в БД, копирует/декодирует картинки в `public/products/` и обновляет пути

### Перенос на другой ПК
1. Скопируйте всю папку проекта на флешку (включая `apps/frontend/public/` и `apps/backend/prisma/dev.db`)
2. На новом ПК: `npm install && cd apps/backend && npm run setup`
3. Запустите бэкенд и фронтенд — всё работает!

---

## Технологии

- **Fastify** 4.x — высокопроизводительный Node.js сервер
- **Prisma** 5.x — ORM с автогенерацией типов
- **Vue 3** + Composition API — реактивный фреймворк
- **Pinia** — управление состоянием
- **Vue Router** — клиентская маршрутизация
- **SQLite** — встроенная БД (не требует установки)
- **EmailJS** — отправка писем без SMTP-сервера
- **TypeScript** — строгая типизация