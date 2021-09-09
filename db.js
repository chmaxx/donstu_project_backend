const mongoose = require('mongoose');

// Функция подключения к базе данных 
function connectToDB() {
	console.log('Попытка подключиться к базе данных...')
	return api_config ?
		mongoose.connect(api_config.db_settings.url, {keepAlive: true, keepAliveInitialDelay: api_config.db_settings.reconnect_delay}).then(
			() => {console.log('Успешное подключение к базе данных!')},
			() => {console.log('Не удалось подключиться к базе данных!')}) : 
		'Не удается установить соединение с базой данных: отсутствует конфиг!';
};

// Авто-реконнект не работает при получении еррора. В таких случаях нужно отключиться
// (он потом поднимется)
mongoose.connection.on('error', function() {
  mongoose.disconnect()
});

mongoose.connection.on('disconnected', function() {
	// Устанавливаем время на реконнект в миллисекундах (либо из конфига, либо 5000 по умолчанию) 
  setTimeout(connectToDB, api_config ? api_config.db_settings.reconnect_delay : 5000);
});


/* Эта функция будет вызываться при каждом запросе на API
 * Функция проверяет соединение с базой, и, если оно не установлено, возвращает ошибку
 * next отвечает за дальнейшее "движение" запроса 
 */
function checkConnection(res, req, next) {
	switch (mongoose.connection.readyState) {
		
		// отключен от базы
		case 0:
			var error = new Error('Соединение с базой данных не установлено!');
			error.status = 500;
			next(error);
			break;
		
		// активное соедение
		case 1:
			break;
		
		// подключение
		case 2:
			var error = new Error('Идет соединение с базой данных!');
			error.status = 500;
			next(error);
			break;
		
		// отключение
		case 3:
			var error = new Error('Идет отключени от базы данных!');
			error.status = 500;
			next(error);
			break;	
		
		// остальные случаи		
		default:
			var error = new Error('Непредвиденное состояние базы данных! mongoose.readyState: ' + mongoose.connection.readyState);
			error.status = 500;
			next(error);
			break;		
	}

  next();	
}

// Подключаемся к базе данных
connectToDB();

module.exports = checkConnection;
