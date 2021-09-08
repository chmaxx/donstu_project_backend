const fs = require('fs');

module.exports = function(app, config) {
  fs.readdir('./api/routes/', (err, files) => {
    if (err) return console.error('Ошибка при чтении маршрутов!');

    // Обращение к маршрутам будет проходить по /версия_api/маршрут
    var api_placeholder = '/' + config.api_version + '/'

    // Итерируем по всем файлам внутри routes/
    files.forEach((file) => {
      // Не обрабатываем файлы с non-js расширением
      if (file.split('.')[1] != 'js') {
        console.error('В папке routes находится файла с расширением, отличным от .js !' + file)
        // В контексте forEach return работает так же, как continue в нормальных циклах
        return 
      }

      // Получаем название файла без его расширения
      var route_name = file.split('.').slice(0, -1).join('.')

      // Загружаем маршрут 
      app.use(api_placeholder + route_name, require('./routes/' + route_name))
      console.log('[+]Загружен маршрут ' + route_name + '!')
    })

  })
}
