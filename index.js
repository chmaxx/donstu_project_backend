// Инициализация всего, что нужно для работы бекэнда

const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const server         = express();

/* Подгружаем конфиг 
 * Если не удается подгрузить - отменяем запуск сервера
 */
var config 
try {
  config = require('./config/config.json');
} catch (err) {
  console.error('Не удается загрузить конфигурационный файл!')
  return 
}

// Научим express обрабатывать формы 
server.use(bodyParser.urlencoded({ extended: true }));

// Установим переменную port
server.set('port', config.port || 8000);

// Подгружаем маршруты
require('./api/routes')(server, config)

// Подключаемся к базе данных. При успешном подключении - начинаем прослушку 
MongoClient.connect(config.db_settings.url, (err, database) => {
  if (err) return console.error(err)
    
  let port = server.get('port')

  server.listen(port, () => {
    console.log('Начинаем прослушку порта ' + port);
  });               
})
