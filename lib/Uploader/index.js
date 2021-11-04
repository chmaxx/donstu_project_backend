const { existsSync, mkdirSync } = require('fs');
const { join } = require('path');

const Logger = require('../Logger');
const log = new Logger(api_config.logger, 'Uploader');

let uploadPath, uploadPathArray;

const setupUploadsFilesystem = () => {
  log.info('Инициализируем файловую систему...');
  /* в конфиге мы допускаем красивое написание пути (по типку uploads/)
   * но здесь в аргумент join передаются "составляющие" пути
   * поэтому мы сначала убираем все слеши из конфига, а затем распаковываем массив
   * таким образом, мы преобразуем читабельный человеком путь в тот, что нужен path
   */
  uploadPathArray = api_config.uploads_path.split('/');
  uploadPath = join(...uploadPathArray);

  if (existsSync(uploadPath)) {
    return log.info('Файловая система уже была инициализирована ранее!');
  } else {
    mkdirSync(uploadPath);
    log.info(`Создана папка ${uploadPath}`);
  }
};

setupUploadsFilesystem();

module.exports = { uploadPath, uploadPathArray };
