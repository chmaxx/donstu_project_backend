/* Маршрут прдназначен для тестирования
*
* Должен вернуть 200 OK статус при нормальной работе
*
* При ошибке ничего не вернуть или непосредственно код ошибки
*/

const {Router} = require('express');
const router = Router();

// "/" тут относительно названия файла маршрута
router.route('/')
	.get((req, res) => {
		console.log('GET TEST REQUEST')
		res.sendStatus(200);
	})

module.exports = router
