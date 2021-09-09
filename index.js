let app         = require('express')();
let bodyParser  = require('body-parser');
let fs          = require('fs');

// Подгружаем конфиг 
// Если не удается подгрузить - отменяем запуск сервера
let config;
try {
  config = require('./config/config.json');
  global.api_config = config;
} catch (err) {
  console.error('Не удается загрузить конфигурационный файл!');
  return;
}

// Учим Express парсить application/json
app.use(bodyParser.json());

// Учим Express парсить application/x-www-form-urlencoded (и заодно body)
app.use(bodyParser.urlencoded({ extended: false }));

// Подгружаем маршруты
require('./api/routes')(app, config);

// Инициализация базы данных 
if (api_config.db_settings.enabled) {
  app.use(require('./db'));
} else {
  console.log('Не подключаемся к базе данных, потому что она отключена в конфиге!');
}

// Подгружаем ssl сертификат и ключ
// В случае ошибки при https - отменяем запуск сервера
let cert_opt;
try {
  cert_opt = {
    key: fs.readFileSync(config.key_path),
    cert: fs.readFileSync(config.cert_path)
  };
  console.log("сертификат загружен")
} catch (err) {
  if (config.https_enable) {
    console.log('Ошибка при загрузке ssl сертификата и ключа!');
    console.log('Отмена запуска сервера на https. Смените порт или укажите правильный путь к ssl сертификату и ключу');
    return;
  } else {
    console.log('SSL сертификат и ключ не загружены. Работа по HTTPS невозможна');
  }
}

// запуск с нужным протоколом
if (config.https_enable) {
  let https = require('https').createServer(cert_opt, app);
  https.listen(config.port, config.ip, function () {
    console.log('HTTPS: Начинаем прослушку порта ', config.port, "на ip адрессе ", config.ip);
  });
} else {
  // Начинаем прослушку на http
  app.listen(config.port, config.ip, () => {
    console.log('HTTP: Начинаем прослушку порта ', config.port, "на ip адрессе ", config.ip);
  }); 
}
