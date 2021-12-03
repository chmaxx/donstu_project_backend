const ApiError = require('../../lib/ApiError');
const { checkConnection } = require('../../lib/Database/utils');

module.exports = function (req, res, next) {
  if (API_CONFIG && !API_CONFIG.db_settings.enabled) {
    throw ApiError.BadRequest('База данных отключена!');
  }

  checkConnection(req, res, next);
};
