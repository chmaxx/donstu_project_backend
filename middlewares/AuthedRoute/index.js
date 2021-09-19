const TokenService = require('../../features/users/tokenService');
const ApiError = require('../ApiErrorException');

module.exports = function(req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;
       
        if (!authorizationHeader) {
            throw ApiError.Unauthorized();
        }

        const accessToken = authorizationHeader.split(' ')[1];

        if (!accessToken) {
            throw ApiError.Unauthorized();
        }

        const userData = TokenService.validateAccessToken(accessToken);

        if (!userData) {
            throw ApiError.Unauthorized();
        }

        //if (!userData.isActivated) {
        //    throw ApiError.UnactivatedUser();
        //}

        req.user = userData; 

        next();
    } catch(e) {
        return next(e);
    }
}
