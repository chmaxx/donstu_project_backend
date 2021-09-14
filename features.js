const fs = require('fs');

// TODO: отдельная middleware для логирования
function log(msg) {
	return console.log('[Features]', msg)
}

// Функция для безопасной загрузки файла 
// может, в ней пока нет необходимости? загружается только один файл
function safeRequire(featureName, path) {
	let require_return_value;
	// Пытаемся загрузить файл
	try {
		require_return_value = require(path);
		log('Загружен ' + featureName + '!');
	// Возможно есть способ обойтись без этого, но я не уверен
	// просто молчим
	} catch (err) {console.log(err)}

	return require_return_value;
}

log('Начало загрузки...')

const origin_path = './features/'

module.exports = function(app) {
	// Получаем содержимое папки features
	fs.readdir(origin_path, {withFileTypes: true}, (err, contents) => {
		if (err) return log('Ошибка при загрузке!');

		contents.forEach((matchDirent) => {
			// Подгружаем только папки
			if (!matchDirent.isDirectory()) return; 

			const curr_path = origin_path + matchDirent.name + '/'; 
			safeRequire(matchDirent.name, curr_path + 'index')(app);
		});
	})
}
