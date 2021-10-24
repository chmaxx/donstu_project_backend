const ApiError = require('../ApiErrorException');
const {validationResult} = require('express-validator');

module.exports = function(req, res, next) {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        throw ApiError.BadRequest('Ошибка при валидации введенных данных!', validationErrors.array());
    }

    next()
}
