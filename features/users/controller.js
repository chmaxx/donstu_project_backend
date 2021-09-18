const ApiError = require('../../middlewares/ApiErrorException');
const UserService = require('./userService');


class UserController {
    async register(req, res, next) {
        try {
            const {nickname, email, password} = req.body; 

            if (!email) {
                throw ApiError.BadRequest("Необходимо ввести почту!");
            }

            if (!password) {
                throw ApiError.BadRequest("Необходимо ввести пароль!");q
            }

            const userData = await UserService.registration(nickname, email, password);

            // мы должны умножать maxAge на 1000, поскольку в аргументах ожидаются мс (а в конфиге секунды)
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: api_config.jwt.refresh_token_lifetime * 1000, 
                httpOnly: true});

            return res.json(userData);            
        } catch (e) {
            next(e); 
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body;
            const userData = await UserService.login(email, password);

            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: api_config.jwt.refresh_token_lifetime, 
                httpOnly: true});

            return res.json(userData);
        } catch (e) {
            next(e); 
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await UserService.logout(refreshToken);
            
            res.clearCookie('refreshToken');
            
            return res.json(token);
        } catch (e) {
            next(e); 
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await UserService.activate(activationLink);

            // TODO: редирект
            return res.json({message: "Аккаунт успешно активирован!"});
        } catch (e) {
            next(e); 
        }
    }

    async refreshToken(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await UserService.refresh(refreshToken);

            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: config.refresh_token_lifetime, 
                httpOnly: true});

            res.status(200).json(userData);
        } catch (e) {
            next(e); 
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await UserService.getAllUsers();
            res.json(users);
        } catch(e) {
            console.log(e);
        }
    }   
}

module.exports = new UserController();
