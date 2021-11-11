const Tokens = require('../../features/users/tokens');
const ApiError = require('../ApiErrorException');

module.exports = function (req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      throw ApiError.Unauthorized();
    }

    const accessToken = authorizationHeader.split(' ')[1];

    if (!accessToken) {
      throw ApiError.Unauthorized();
    }

    const userData = Tokens.validateAccessToken(accessToken);

    if (!userData) {
      throw ApiError.Unauthorized();
    }

    //if (!userData.isActivated) {
    //    throw ApiError.UnactivatedUser();
    //}

    req.user = userData;

    next();
  } catch (e) {
    return next(e);
  }
};
