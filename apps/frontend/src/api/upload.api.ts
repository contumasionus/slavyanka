import apiClient from './client';

/**
 * Преобразует File в data URL (base64)
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Не удалось прочитать файл'));
    reader.readAsDataURL(file);
  });
}

export const uploadApi = {
  /**
   * Загрузить файл на сервер
   * Отправляет файл как base64 строку в JSON
   */
  async uploadFile(file: File) {
    const base64 = await fileToBase64(file);

    const response = await apiClient.post('/upload', {
      file: base64,
      filename: file.name,
    });

    return response.data;
  },

  /**
   * Получить список всех загруженных файлов (галерея)
   */
  async listUploads() {
    const response = await apiClient.get('/uploads');
    return response.data;
  },

  /**
   * Удалить загруженный файл
   */
  async deleteUpload(filename: string) {
    const response = await apiClient.delete(`/uploads/${filename}`);
    return response.data;
  },
};