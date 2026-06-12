import { FastifyRequest, FastifyReply } from 'fastify';
import * as fs from 'fs';
import * as path from 'path';

const UPLOADS_DIR = path.resolve(__dirname, '../../../frontend/public/images/uploads');

// Допустимые типы изображений
const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'image/svg+xml': '.svg',
};

export class UploadController {
  async uploadFile(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as { file?: string; filename?: string };

      if (!body || !body.file) {
        return reply.status(400).send({ error: 'Нет файла для загрузки' });
      }

      // Определяем тип по сигнатуре base64
      const match = body.file.match(/^data:(image\/\w+);base64,/);
      if (!match) {
        return reply.status(400).send({ error: 'Неверный формат файла. Ожидается data URL (base64)' });
      }

      const mimeType = match[1];
      const ext = ALLOWED_TYPES[mimeType];
      if (!ext) {
        return reply.status(400).send({ 
          error: `Недопустимый тип файла: ${mimeType}. Разрешены: jpg, png, gif, webp, svg` 
        });
      }

      // Извлекаем base64-данные без префикса
      const base64Data = body.file.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      // Проверка размера (макс 10MB)
      if (buffer.length > 10 * 1024 * 1024) {
        return reply.status(400).send({ error: 'Файл слишком большой. Максимальный размер: 10MB' });
      }

      // Убеждаемся что папка существует
      if (!fs.existsSync(UPLOADS_DIR)) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
      }

      // Генерируем уникальное имя файла
      const safeName = body.filename 
        ? body.filename.replace(/[^a-zA-Z0-9а-яА-Я_-]/g, '_').slice(0, 50) 
        : 'image';
      const uniqueName = `${Date.now()}_${safeName}${ext}`;

      const filePath = path.join(UPLOADS_DIR, uniqueName);
      fs.writeFileSync(filePath, buffer);

      const imageUrl = `/images/uploads/${uniqueName}`;

      return reply.send({
        success: true,
        url: imageUrl,
        filename: uniqueName,
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      return reply.status(500).send({ error: 'Ошибка загрузки файла: ' + (error.message || '') });
    }
  }

  async listUploads(_request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!fs.existsSync(UPLOADS_DIR)) {
        return reply.send({ files: [] });
      }

      const allowedExts = Object.values(ALLOWED_TYPES);
      const files = fs.readdirSync(UPLOADS_DIR)
        .filter(file => {
          const ext = path.extname(file).toLowerCase();
          return allowedExts.includes(ext);
        })
        .map(file => {
          const fullPath = path.join(UPLOADS_DIR, file);
          const stat = fs.statSync(fullPath);
          return {
            filename: file,
            url: `/images/uploads/${file}`,
            size: stat.size,
            uploadedAt: stat.mtime,
          };
        })
        .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());

      return reply.send({ files });
    } catch (error) {
      console.error('List uploads error:', error);
      return reply.status(500).send({ error: 'Не удалось получить список файлов' });
    }
  }

  async deleteUpload(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { filename } = request.params as { filename: string };

      // Защита от path traversal
      if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
        return reply.status(400).send({ error: 'Недопустимое имя файла' });
      }

      const filePath = path.join(UPLOADS_DIR, filename);

      if (!fs.existsSync(filePath)) {
        return reply.status(404).send({ error: 'Файл не найден' });
      }

      fs.unlinkSync(filePath);
      return reply.send({ success: true, message: 'Файл удалён' });
    } catch (error) {
      console.error('Delete upload error:', error);
      return reply.status(500).send({ error: 'Не удалось удалить файл' });
    }
  }
}