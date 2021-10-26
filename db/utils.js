const mongoose = require('mongoose');
const ApiError = require('../middlewares/ApiErrorException');

// подключаем логгер MongoDB
config = require('../config/config.json');
const Logger = require('../middlewares/Logger');
const log = new Logger(config.logger, 'MongoDB');

function connectToDB() {
  log.info('Попытка подключиться к базе данных...');
  return api_config
    ? mongoose
        .connect(api_config.db_settings.url, {
          keepAlive: true,
          keepAliveInitialDelay: api_config.db_settings.reconnect_delay,
        })
        .then(
          () => {
            log.info('Успешное подключение к базе данных!');
          },
          () => {
            log.info('Не удалось подключиться к базе данных!');
          }
        )
    : 'Не удается установить соединение с базой данных: отсутствует конфиг!';
}

function checkConnection(res, req, next) {
  switch (mongoose.connection.readyState) {
    // отключен от базы
    case 0:
      next(ApiError.Database(['Соединение с базой данных не установлено!']));
      break;

    // активное соедение
    case 1:
      break;

    // подключение
    case 2:
      next(ApiError.Database(['Идет соединение с базой данных!']));
      break;

    // отключение
    case 3:
      next(ApiError.Database(['Идет отключение от базы данных!']));
      break;

    // остальные случаи
    default:
      next(
        ApiError.Database([
          'Непредвиденное состояние базы данных! mongoose.readyState: ' +
            mongoose.connection.readyState,
        ])
      );
      break;
  }

  next();
}

module.exports.connectToDB = connectToDB;
module.exports.checkConnection = checkConnection;
