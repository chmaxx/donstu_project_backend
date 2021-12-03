const ApiError = require('../../lib/ApiError');

// подключаем логгер ErrorCatcher
const Logger = require('log-my-ass');
const log = new Logger(api_config.logger, 'ErrorCatcher');

module.exports = (err, req, res, next) => {
  log.error(err);
  if (err instanceof ApiError) {
    return res.status(err.code).json(ApiError.JsonFormat(err));
  }

  const UnexpectedError = new ApiError();

  return res.status(UnexpectedError.code).json(ApiError.JsonFormat(UnexpectedError));
};
