const express = require('express');
let app = express();
let cookieParser = require('cookie-parser');
let fs = require('fs');

// Подгружаем конфиг 
// Если не удается подгрузить - отменяем запуск сервера
let config;
try {
  config = require('./config/config.json');
  global.api_config = config;
} catch (err) {
  console.error('[Start] Не удается загрузить конфигурационный файл!');
  return;
}

// Учим Express парсить application/json
app.use(express.json());

// Учим Express парсить application/x-www-form-urlencoded (и заодно body)
app.use(express.urlencoded({extended: false}));

// Учим Express работать с Cookie
app.use(cookieParser());

// Инициализация базы данных 
if (api_config.db_settings.enabled) {
  require('./db/connection')
  const {checkConnection} = require('./db/utils')
  app.use(checkConnection);
} else {
  console.log('[START] Не подключаемся к базе данных, потому что она отключена в конфиге!');
}

// Подгружаем маршруты
require('./features')(app)

// делаем айпи необязательным значением конфига
let ip = config.ip !== undefined ?
  config.ip :
  '127.0.0.1';

app.listen(config.port, ip, () => {
  console.log('[Start] Запущено на http://', ip, ':', config.port);
});
