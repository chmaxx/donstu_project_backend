const { existsSync, mkdirSync } = require('fs');
const { resolve } = require('path');
const Logger = require('log-my-ass');
const log = new Logger(API_CONFIG.logger, 'Uploader');

let uploadPath;

const setupUploadsFilesystem = () => {
  log.info('Инициализируем файловую систему...');
  // фиксим путь относительно требований среды, в которой работает приложение
  uploadPath = resolve(API_CONFIG.uploads_path);

  if (existsSync(uploadPath)) {
    return log.info('Файловая система уже была инициализирована ранее!');
  } else {
    mkdirSync(uploadPath);
    log.info(`Создана папка ${uploadPath}`);
  }
};

setupUploadsFilesystem();

module.exports = { uploadPath };
