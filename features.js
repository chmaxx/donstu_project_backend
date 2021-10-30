const fs = require('fs');
const errorCatcher = require('./middlewares/ErrorCatcher');

// подключаем логгер Features
config = require('./config/config.json');
const Logger = require('./lib/Logger');
const log = new Logger(config.logger, 'Features');

// Функция для безопасной загрузки файла
// может, в ней пока нет необходимости? загружается только один файл
function safeRequire(featureName, path) {
  let require_return_value;
  // Пытаемся загрузить файл
  try {
    require_return_value = require(path);
    log.info('Загружен ' + featureName + '!');
    // Возможно есть способ обойтись без этого, но я не уверен
    // просто молчим
  } catch (err) {}

  return require_return_value;
}

log.info('Начало загрузки...');

const origin_path = './features/';

module.exports = function (app) {
  // Получаем содержимое папки features
  fs.readdir(origin_path, { withFileTypes: true }, (err, contents) => {
    if (err) return log.info('Ошибка при загрузке!');

    contents.forEach((matchDirent) => {
      // Подгружаем только папки
      if (!matchDirent.isDirectory()) return;

      const curr_path = origin_path + matchDirent.name + '/';
      safeRequire(matchDirent.name, curr_path + 'index')(app);
    });

    // После загрузки всех маршрутов необходимо подключить обработчик ошибок
    // Примечательно, что это НЕОБХОДИМО делать в последнюю очередь
    app.use(errorCatcher);
  });
};
