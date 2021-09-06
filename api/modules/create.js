/*
	Это тестовый модуль - здесь я просто проверяю работу приложения 
	На данном этапе мы можем отправить POST-запрос на приложение <сайт>:8000/create-post
	с флагом x-www-form-urlencoded и определенными данными в Body, а затем получить их здесь
	в отформатированном виде (req.body)
*/
module.exports = function(server, db) {
	server.post('/create-post', (req, res) => {
		console.log('Got POST!')
		console.log(req.body)

		let test_val = req.test_value ? req.test_value : 'Nothing in test_value...'
		res.send('Got your POST! ' + test_val)
	});
};
