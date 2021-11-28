const UserService = require('./service');
const { ResponseMessage, formatUser, formatUpload } = require('../utils');
const isMongoId = require('../../node_modules/validator/lib/isMongoId');

const Logger = require('log-my-ass');
const log = new Logger(api_config.logger, 'Users');

class UserController {
  static async register(req, res, next) {
    try {
      const { login, firstName, lastName, email, password } = req.body;
      const userData = await UserService.registration(
        login,
        firstName,
        lastName,
        email,
        password
      );

      // мы должны умножать maxAge на 1000, поскольку в аргументах ожидаются мс (а в конфиге секунды)
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: api_config.jwt.refresh_token_lifetime * 1000,
        httpOnly: true,
        sameSite: 'Strict',
        secure: true,
      });

      log.info(
        `Зарегистрирован новый пользователь: ${formatUser({
          firstName,
          lastName,
          _id: userData.user.id,
        })}`
      );

      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await UserService.login(email, password);

      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: api_config.jwt.refresh_token_lifetime * 1000,
        httpOnly: true,
        sameSite: 'Strict',
        secure: true,
      });

      log.info(`Пользователь ${formatUser(userData.user.id.toString())} залогинился`);

      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  static async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await UserService.logout(refreshToken);

      res.clearCookie('refreshToken');

      return res.json(token);
    } catch (e) {
      next(e);
    }
  }

  static async changePassword(req, res, next) {
    try {
      const { accessToken, refreshToken } = await UserService.changePassword(
        req.user._id,
        req.body.oldPassword,
        req.body.newPassword
      );

      res.cookie('refreshToken', refreshToken, {
        maxAge: api_config.jwt.refresh_token_lifetime * 1000,
        httpOnly: true,
        sameSite: 'Strict',
        secure: true,
      });

      log.info(`Пользователь ${formatUser(req.user)} сменил пароль`);

      return res.json(
        ResponseMessage('Успешная смена пароля!', { accessToken, refreshToken })
      );
    } catch (e) {
      next(e);
    }
  }

  static async changeAvatar(req, res, next) {
    try {
      await UserService.changeAvatar(req.user._id, req.body.upload_id);

      log.info(
        `Пользователь ${formatUser(req.user)} сменил аватар на ${formatUpload(
          req.body.upload_id
        )}`
      );

      return res.json(ResponseMessage('Аватарка успешно обновлена!'));
    } catch (e) {
      next(e);
    }
  }

  static async getInfo(req, res, next) {
    const userID = req.body.userID;

    // По умолчанию возвращаем данные пользователя, отправляющего запрос
    if (!userID || userID == req.user._id) {
      const user = req.user;

      return res.json({
        _id: user._id,
        login: user.login,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isActivated: user.isActivated,
        usergroup: user.usergroup,
        avatarUploadID: user.avatar,
      });
    }

    if (!isMongoId(userID)) return res.status(400).json(ResponseMessage('Неверный userID!'));

    try {
      const user = await UserService.getInfo(userID);
      res.json(user);
    } catch (e) {
      next(e);
    }
  }

  static async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await UserService.activate(activationLink);

      // TODO: редирект
      return res.json(ResponseMessage('Аккаунт успешно активирован!'));
    } catch (e) {
      next(e);
    }
  }

  static async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await UserService.refresh(refreshToken);

      log.info(`Пользователь ${formatUser(userData)} обновил refreshToken`);

      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: api_config.jwt.refresh_token_lifetime * 1000,
        httpOnly: true,
        sameSite: 'Strict',
        secure: true,
      });

      res.json(userData);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = UserController;
