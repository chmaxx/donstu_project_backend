/* Тестовый маршрут Posts 
 * Запросы происходят по пути:
 *
 * http://<сайт>/1.0/posts/
 *
 * Далее все добавляемые маршруты через router будут автоматически отнесенены к 1.0/posts/
 * 
 * Например: 
 *
 * 		router.route('/create')
 *			.get(console.log)
 *
 * ^^^ при такой инициализации маршрута полный путь до него будет:
 * http://<сайт>/1.0/posts/create
 *
 * при этом стоит обратить внимание, что 1.0 здесь - версия API, указанная в конфиге
 */
const {Router} 	= require('express');
const router 		= Router();

router.route('/')
	.get((req, res) => {
		console.log('GET /1.0/posts/')
		res.send(req.query);
	})

module.exports = router
