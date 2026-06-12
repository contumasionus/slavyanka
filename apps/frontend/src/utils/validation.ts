/**
 * Централизованные утилиты валидации и очистки данных
 */

/**
 * Валидация email по строгому regex
 */
export function isValidEmail(email: string): boolean {
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
  return re.test(email.trim());
}

/**
 * Очистка номера телефона от всех нецифровых символов, кроме +
 */
export function sanitizePhone(value: string): string {
  return value.replace(/[^\d+]/g, '');
}

/**
 * Форматирование номера телефона в маску +7 (XXX) XXX-XX-XX
 */
export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  let result = '+7';
  if (digits.length > 1) result += ' (' + digits.slice(1, 4);
  if (digits.length >= 5) result += ') ' + digits.slice(4, 7);
  if (digits.length >= 8) result += '-' + digits.slice(7, 9);
  if (digits.length >= 10) result += '-' + digits.slice(9, 11);
  return result;
}

/**
 * Валидация номера телефона (10-11 цифр после очистки)
 */
export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 11;
}

/**
 * Удаление HTML тегов из строки (XSS защита)
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Очистка пользовательского ввода: удаление HTML тегов + trim
 */
export function sanitizeInput(value: string): string {
  return stripHtml(value.trim());
}

/**
 * Валидация имени пользователя (старая, для совместимости)
 */
export function isValidName(name: string): boolean {
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 50;
}

/**
 * Обрезание строки до максимальной длины
 */
export function truncate(str: string, max: number): string {
  return str.slice(0, max);
}

/**
 * Валидация промокода
 */
export function isValidPromoCode(code: string): boolean {
  return /^[A-Za-z0-9_-]{3,20}$/.test(code.trim());
}

// ======= НОВЫЕ ФУНКЦИИ ДЛЯ СТРОГОЙ ВАЛИДАЦИИ =======

/**
 * Проверка, что имя содержит только русские буквы,
 * начинается с заглавной, одно слово, 2-30 символов
 */
export function isValidRussianName(name: string): boolean {
  const regex = /^[А-Я][а-яёЁ]{1,29}$/;
  return regex.test(name.trim());
}

/**
 * Капитализация первой буквы, остальные строчные
 */
export function capitalizeFirstLetter(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Валидация email по белому списку доменов
 */
export function isValidWhitelistedEmail(email: string): boolean {
  const allowedDomains = [
    'mail.ru',
    'gmail.com',
    'yandex.ru',
    'yandex.com',
    'inbox.ru',
    'bk.ru',
    'list.ru',
    'outlook.com',
    'hotmail.com',
    'icloud.com',
  ];

  const emailLower = email.toLowerCase().trim();
  const parts = emailLower.split('@');
  if (parts.length !== 2 || !parts[0] || !parts[1]) return false;

  const domain = parts[1];
  return allowedDomains.includes(domain);
}

/**
 * Очистка русской строки: удаление всего кроме кириллицы + капитализация
 */
export function sanitizeRussianName(input: string): string {
  // Удаляем всё кроме русских букв
  const cleaned = input.replace(/[^а-яА-ЯёЁ]/g, '');
  // Делаем первую букву заглавной, остальные строчными
  return capitalizeFirstLetter(cleaned);
}

/**
 * Получение понятного сообщения об ошибке для имени
 */
export function getRussianNameError(name: string): string | null {
  const trimmed = name.trim();
  if (trimmed.length < 2) return 'Имя должно содержать минимум 2 буквы';
  if (trimmed.length > 30) return 'Имя должно содержать не более 30 букв';
  if (!/^[а-яА-ЯёЁ]+$/.test(trimmed)) return 'Имя должно содержать только русские буквы';
  if (!/^[А-Я]/.test(trimmed)) return 'Имя должно начинаться с заглавной буквы';
  return null;
}

/**
 * Получение понятного сообщения об ошибке для email
 */
export function getWhitelistedEmailError(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) return 'Введите email';
  if (!trimmed.includes('@')) return 'Email должен содержать символ @';
  const parts = trimmed.split('@');
  if (!parts[0]) return 'Введите имя пользователя перед @';
  if (!parts[1]) return 'Введите домен после @';
  if (!isValidWhitelistedEmail(trimmed)) return 'Неверно введена почта';
  return null;
}
