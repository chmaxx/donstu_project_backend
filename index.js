// Инициализация всего, что нужно для работы бекэнда

const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const db_config      = require('./config/db');
const bodyParser     = require('body-parser');
const server         = express();

// Прослушиваемый порт
// TODO: отдельный конфиг-файл (.json ?)
const port = 8000 

// Научим express обрабатывать формы 
server.use(bodyParser.urlencoded({ extended: true }));

// Подгружаем модули
require('./api/modules')(server, {})

// Подключаемся к базе данных. При успешном подключении - начинаем прослушку 
MongoClient.connect(db_config.url, (err, database) => {
  if (err) return console.log(err)
  
  require('./api/modules')(server, database);

  server.listen(port, () => {
    console.log('Начинаем прослушку порта ' + port);
  });               
})
