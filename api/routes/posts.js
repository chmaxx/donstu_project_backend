/* Тестовый маршрут Posts 
 * Запросы происходят по пути:
 *
 * http://<сайт>/v1/posts/
 *
 * Далее все добавляемые маршруты через router будут автоматически отнесенены к v1/posts/
 * 
 * Например: 
 *
 * 		router.route('/create')
 *			.get(console.log)
 *
 * ^^^ при такой инициализации маршрута полный путь до него будет:
 * http://<сайт>/v1/posts/create
 *
 * при этом стоит обратить внимание, что v1 здесь - версия API, указанная в конфиге
 */
const {Router} 	= require('express');
const router 		= Router();

router.route('/')
	.get((req, res) => {
		console.log('GET /v1/posts/')
		res.send(req.query);
	})

module.exports = router
