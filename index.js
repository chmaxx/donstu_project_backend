const express = require('express');
let app = express();
let cookieParser = require('cookie-parser');
let fs = require('fs');

// Подгружаем конфиг
const config = require('load-my-config')('config');
global.API_CONFIG = config;

// подключаем логгер Start
const Logger = require('log-my-ass');
const log = new Logger(config.logger, 'Start');

// Учим Express парсить application/json
app.use(express.json());

// Учим Express парсить application/x-www-form-urlencoded (и заодно body)
app.use(express.urlencoded({ extended: false }));

// Учим Express работать с Cookie
app.use(cookieParser());

// подключаем логгер к Express
app.use((req, res, next) => {
  log.access(req, res);
  next();
});

// Инициализация базы данных
if (API_CONFIG.db_settings.enabled) {
  require('./lib/Database');
  const { checkConnection } = require('./lib/Database/utils');
  app.use(checkConnection);
} else {
  log.info('Не подключаемся к базе данных, потому что она отключена в конфиге');
}

// Создаем директории, необходимые для работы маршрута Uploads
require('./lib/Uploader');

// Подгружаем маршруты
require('./features')(app);

app.listen(config.port, config.ip, () => {
  log.info(`Запущено на http://${config.ip}:${config.port}`);
});
