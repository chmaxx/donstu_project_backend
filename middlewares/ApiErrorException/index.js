class ApiError extends Error {
    message; 
    errors;
    code; 

    constructor(code = 500, message = "Непредвиденная ошибка", errors = []) {
        super(message);
        this.code = code;
        this.message = message; 
        this.errors = errors;
    }

    static Unauthorized() {
        return new ApiError(401, "Пользователь не авторизован");
    }

    static BadRequest(message, errors = []) {
        return new ApiError(400, message, errors);
    }

    static JsonFormat(Error) {
        return {message: Error.message, errors: Error.errors};
    }
}

module.exports = ApiError;
