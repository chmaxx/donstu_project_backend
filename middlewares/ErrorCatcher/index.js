const ApiError = require('../ApiErrorException');

module.exports = (err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.code).json({message: err.message, errors: err.errors});
    }

    const UnexpectedError = ApiError();
    
    return res.status(UnexpectedError.code).json(ApiError.JsonFormat(UnexpectedError));
}
