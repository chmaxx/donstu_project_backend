/* Маршрут предназначен для тестирования
 *
 * Должен вернуть 200 OK статус при нормальной работе
 *
 * При ошибке ничего не вернуть или непосредственно код ошибки
 */

const { Router } = require('express');
const router = Router();

module.exports = (app) => {
  router.all('/', (req, res) => {
    res.sendStatus(200);
  });

  app.use('/' + api_config.api_version, router);
  app.use('/' + api_config.api_version + '/status', router);
};
