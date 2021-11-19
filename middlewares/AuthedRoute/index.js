const Tokens = require('../../features/users/tokens');
const ApiError = require('../ApiErrorException');

module.exports = async function (req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      throw ApiError.Unauthorized();
    }

    const accessToken = authorizationHeader.split(' ')[1];

    if (!accessToken) {
      throw ApiError.Unauthorized();
    }

    const validationData = await Tokens.validateAccessToken(accessToken);

    if (!validationData) {
      throw ApiError.Unauthorized();
    }

    req.user = validationData.user;

    next();
  } catch (e) {
    return next(e);
  }
};
