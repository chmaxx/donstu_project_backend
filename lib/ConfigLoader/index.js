const Ajv = require('ajv');
const ajv = new Ajv();

function loadConfig() {
  // стандартный конфиг
  try {
    var config_default = require('../../config/config_default.json');
    var validate = ajv.compile(require('../../schemes/config_schema.json'));
    if (config_default.config_validate == true) {
      if (!validate(config_default)) {
        console.log(validate.errors);
        return 0;
      }
    }
  } catch (err) {
    console.log(err);
    return;
  }

  // подключаем логгер loadConfig
  const Logger = require('log-my-ass');
  const log = new Logger(config_default.logger, 'ConfigLoader');

  try {
    var config = require('../../config/config.json');
    if (config.config_validate == true) {
      if (!validate(config)) {
        throw validate.errors;
        //todo: логгирование
      }
    }
    log.info('Конфигурация загружена');
  } catch (err) {
    log.info('Не удается загрузить конфигурационный файл');
    log.error(err);
    log.info('Загрузка конфигурации по умолчанию');
    config = config_default;
  }
  //todo: остановка приложения при ломанном дефолтном конфиге
  return config;
}

module.exports = loadConfig;
