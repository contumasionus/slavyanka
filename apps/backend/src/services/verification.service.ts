import { PrismaClient } from '@prisma/client';
import { sendVerificationEmail } from './email.service';

export class VerificationService {
  constructor(private prisma: PrismaClient) {}

  async sendCode(email: string): Promise<void> {
    // Генерируем 6-значный код
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Удаляем старые коды для этого email
    await this.prisma.verificationCode.deleteMany({ where: { email } });

    // Сохраняем новый код (действует 5 минут)
    await this.prisma.verificationCode.create({
      data: {
        email,
        code,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    // Пытаемся отправить письмо, но не блокируем регистрацию при ошибке
    try {
      await sendVerificationEmail(email, code);
      console.log(`[VERIFICATION] Код ${code} отправлен на ${email}`);
    } catch (error: any) {
      console.log(`[VERIFICATION] ⚠️ Не удалось отправить письмо на ${email}`);
      console.log(`[VERIFICATION] Код подтверждения (введите на сайте): ${code}`);
      console.log(`[VERIFICATION] Ошибка: ${error.message}`);
      // Не пробрасываем ошибку — пользователь может ввести код из консоли
    }
  }

  async verifyCode(email: string, code: string): Promise<boolean> {
    const record = await this.prisma.verificationCode.findFirst({
      where: {
        email,
        code,
        expiresAt: { gte: new Date() },
      },
    });

    if (!record) return false;

    // Удаляем использованный код
    await this.prisma.verificationCode.delete({ where: { id: record.id } });

    return true;
  }
}