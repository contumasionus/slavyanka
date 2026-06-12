# 🏗️ Билд стейдж - собираем зависимости и код
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем конфиги монорепо
COPY package.json package-lock.json turbo.json tsconfig.base.json ./

# Копируем все пакеты и приложения
COPY packages ./packages
COPY apps/backend ./apps/backend
COPY apps/frontend ./apps/frontend

# Устанавливаем все зависимости
RUN npm ci

# Собираем весь проект
RUN npm run build

# 🚀 Финальный образ - только то что нужно для запуска
FROM node:20-alpine AS runner

WORKDIR /app

# Копируем собранные артефакты
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/apps/backend ./apps/backend
COPY --from=builder /app/apps/frontend/dist ./apps/frontend/dist
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/node_modules ./node_modules

# Переменные окружения
ENV NODE_ENV production
ENV PORT 3000

# Открываем порты
EXPOSE 3000
EXPOSE 3001

# Команда запуска
CMD ["npm", "run", "dev"]