const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const app         = express();


//Подгружаем конфиг 
//Если не удается подгрузить - отменяем запуск сервера
var config 
try {
  config = require('./config/config.json');
} catch (err) {
  console.error('Не удается загрузить конфигурационный файл!')
  return 
}


// TODO: вынести функцию подключения к дб в отдельный файл
db_connect(config.db_settings.url);

// поднрузка сертификатов и https при 443 порте
if (config.port = 443) {
  console.log('443 port') //todo
} else {
  // Установим переменную port
  app.set('port', config.port || 8000);
}


// Подгружаем маршруты
require('./api/routes')(app, config)

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

let port = app.get('port')

app.listen(port, () => {
  console.log('Начинаем прослушку порта ' + port);
});  
