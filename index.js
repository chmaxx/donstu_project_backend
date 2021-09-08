const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const server         = express();


//Подгружаем конфиг 
//Если не удается подгрузить - отменяем запуск сервера
var config 
try {
  config = require('./config/config.json');
} catch (err) {
  console.error('Не удается загрузить конфигурационный файл!')
  return 
}

// Установим переменную port
server.set('port', config.port || 8000);

// Подгружаем маршруты
require('./api/routes')(server, config)

// Подключаемся к базе данных. 
// При не успешном подключении начинаем в аварийном режиме
MongoClient.connect(config.db_settings.url, (err, database) => {
  if (err) {
    console.log('Ошибка подключения к базе данных!')
    console.log('Пытаемся начать работу в аварийном режиме. Часть маршрутов не будет работать')

    return console.error(err)
  }               
})


let port = server.get('port')

server.listen(port, () => {
  console.log('Начинаем прослушку порта ' + port);
});  
