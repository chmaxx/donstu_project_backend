function loadConfig() {
  // стандартный конфиг
  try {
    var config_default = require('../../config/config_default.json');
  } catch (err) {
    console.log(err);
    return;
  }

  // подключаем логгер loadConfig
  const Logger = require('../Logger');
  const log = new Logger(config_default.logger, 'loadConfig');

  try {
    var config = require('../../config/config.json');
    log.info('Конфиг загружен');
    //todo: проверка валидности значений в отдельности по схеме
  } catch (err) {
    log.info('Не удается загрузить конфигурационный файл');
    log.error(err);
    log.info('Загрузка конфигурации по умолчанию');
    config = config_default;
  }

  return config;
}

module.exports = loadConfig;
