import emailjs from '@emailjs/nodejs';

const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID || 'service_1rwbgjw';
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID || 'template_f5298os';
const EMAILJS_REPLY_TEMPLATE_ID = process.env.EMAILJS_REPLY_TEMPLATE_ID || 'template_p1v6tid';
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY || '-2QE_PXmcBz0ImOUr';
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY || 'dYhJgyWirooaCHRyVybCW';

export async function sendVerificationEmail(to: string, code: string): Promise<void> {
  console.log(`[EMAIL] Отправка кода ${code} на ${to} через EmailJS...`);

  try {
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        to_email: to,
        to_name: to.split('@')[0],
        verification_code: code,
        email: to,
      },
      {
        publicKey: EMAILJS_PUBLIC_KEY,
        privateKey: EMAILJS_PRIVATE_KEY,
      },
    );

    console.log(`[EMAIL] Письмо отправлено на ${to}`, response.status, response.text);
  } catch (error: any) {
    console.log(`[EMAIL] ⚠️ Не удалось отправить письмо на ${to}, ошибка:`, error.message || error);
    console.log(`[EMAIL] Код подтверждения (введите на сайте): ${code}`);
  }
}

export async function sendReplyEmail(options: { to: string; name: string; topic: string; message: string; reply: string }): Promise<void> {
  console.log(`[EMAIL] Отправка ответа на отзыв на ${options.to}`);

  try {
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_REPLY_TEMPLATE_ID,
      {
        to_email: options.to,
        to_name: options.name,
        name: options.name,
        topic: options.topic,
        message: options.message,
        reply: options.reply,
      },
      {
        publicKey: EMAILJS_PUBLIC_KEY,
        privateKey: EMAILJS_PRIVATE_KEY,
      },
    );

    console.log(`[EMAIL] Ответ отправлен на ${options.to}`, response.status, response.text);
  } catch (error: any) {
    console.log(`[EMAIL] ⚠️ Не удалось отправить ответ на ${options.to}, ошибка:`, error.message || error);
  }
}
