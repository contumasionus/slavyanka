import { FastifyInstance } from 'fastify';
import { UploadController } from '../controllers/upload.controller';

export async function uploadRoutes(app: FastifyInstance) {
  const controller = new UploadController();

  // Загрузить файл
  app.post('/upload', controller.uploadFile.bind(controller));

  // Список загруженных файлов
  app.get('/uploads', controller.listUploads.bind(controller));

  // Удалить файл
  app.delete('/uploads/:filename', controller.deleteUpload.bind(controller));
}
