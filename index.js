var app = require('express')();
var MongoClient = require('mongodb').MongoClient;
var fs = require('fs')


//Подгружаем конфиг 
//Если не удается подгрузить - отменяем запуск сервера
var config 
try {
  config = require('./config/config.json');
} catch (err) {
  console.error('Не удается загрузить конфигурационный файл!')
  return 
}


// Подгружаем маршруты
require('./api/routes')(app, config)

// TODO: вынести функцию подключения к дб в отдельный файл
db_connect(config.db_settings.url);


// Подгружаем ssl сертификат и ключ
// В случае ошибки при 443 порте - отменяем запуск сервера
try {
  var cert_opt = {
    key: fs.readFileSync(config.key_path),
    cert: fs.readFileSync(config.cert_path)
  };
} catch (err) {
  if (config.port == 443) {
    console.log('Ошибка при загрузке ssl сертификата и ключа!')
    console.log('Отмена запуска сервера на порту 443. Смените порт или укажите правильеый путь к ssl сертификату и ключу')
    return
  } else {
    console.log('SSL сертификат и ключ не загружены!')
  }
}


// проверка порта для запуска нужного протокола
if (config.port == 443) {
  var https = require('https').createServer(cert_opt,app);
  https.listen(config.port, function () {
    console.log('HTTP: Начинаем прослушку порта ', config.port);
  });
} else {
  // Начинаем прослушку не на https порте
  app.listen(config.port, () => {
    console.log('HTTP: Начинаем прослушку порта ', config.port);
  }); 
}



// Подключаемся к базе данных. 
// При не успешном подключении начинаем в аварийном режиме
function db_connect(db_url) {
  MongoClient.connect(db_url, (err, database) => {
    if (err) {
      console.log('Ошибка подключения к базе данных!')
      console.log('Пытаемся начать работу в аварийном режиме. Часть маршрутов не будет работать')

      return console.error(err)
    }               
  })
}
