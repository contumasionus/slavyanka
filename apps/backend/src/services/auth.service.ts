import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/hash';

// Валидационные функции (дублируем на сервере)
function isValidRussianName(name: string): boolean {
  const regex = /^[А-Я][а-яёЁ]{1,29}$/;
  return regex.test(name.trim());
}

function isValidWhitelistedEmail(email: string): boolean {
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

function sanitizeRussianName(input: string): string {
  const cleaned = input.replace(/[^а-яА-ЯёЁ]/g, '');
  if (!cleaned) return '';
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
}

export class AuthService {
  constructor(private prisma: PrismaClient) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async register(data: { email: string; password: string; name: string }) {
    // Серверная валидация имени
    const sanitizedName = sanitizeRussianName(data.name);
    if (!sanitizedName || !isValidRussianName(sanitizedName)) {
      throw new Error('Имя должно содержать только русские буквы и начинаться с заглавной (2-30 символов)');
    }

    // Серверная валидация email
    const sanitizedEmail = data.email.toLowerCase().trim();
    if (!isValidWhitelistedEmail(sanitizedEmail)) {
      throw new Error('Неверно введена почта');
    }

    const existingUser = await this.prisma.user.findUnique({ where: { email: sanitizedEmail } });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await hashPassword(data.password);
    const user = await this.prisma.user.create({
      data: {
        email: sanitizedEmail,
        password: hashedPassword,
        name: sanitizedName,
        role: 'customer',
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}