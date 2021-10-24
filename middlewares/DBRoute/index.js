const ApiError = require('../ApiErrorException');
const checkConnection = require('../../db');

module.exports = function(req, res, next) {
    if (api_config && !api_config.db_settings.enabled) {
        throw ApiError.BadRequest("База данных отключена!");  
    }    

    checkConnection(req, res, next)
}