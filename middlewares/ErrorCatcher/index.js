const ApiError = require('../ApiErrorException');

// подключаем логгер ErrorCatcher
config = require('../../config/config.json');
const Logger = require('../Logger');
const log = new Logger(config.logger, 'ErrorCatcher');

module.exports = (err, req, res, next) => {
  log.error(err);
  if (err instanceof ApiError) {
    return res
      .status(err.code)
      .json({ message: err.message, errors: err.errors });
  }

  const UnexpectedError = new ApiError();

  return res
    .status(UnexpectedError.code)
    .json(ApiError.JsonFormat(UnexpectedError));
};
