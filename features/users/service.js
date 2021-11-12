const bcrypt = require('bcrypt');
const uuid = require('uuid');

const UserModel = require('./user/model');
const MailService = require('../../lib/Mailer');
const Tokens = require('./tokens');
const ApiError = require('../../middlewares/ApiErrorException');

class UserService {
  static async registration(login, firstName, lastName, email, password) {
    const candidate = await UserModel.findOne({ $or: [{ email }, { login }] });

    if (candidate) {
      throw ApiError.BadRequest(
        // :)))
        `Пользователь с ${
          candidate.email == email ? 'такой почтой' : 'таким логином'
        } уже существует!`
      );
    }

    const activationUUID = uuid.v4();
    const passwordHashed = await bcrypt.hash(password, 3);

    const user = await UserModel.create({
      login,
      firstName,
      lastName,
      email,
      passwordHashed,
      activationUUID,
    });

    // TODO: генерацию ссылки по данным из конфига желательно вынести в отдельный middleware
    await MailService.sendActivationMail(
      email,
      `localhost:${api_config.port}/${api_config.api_version}/users/activate/${activationUUID}`
    );

    return await Tokens.registerUserTokens(user);
  }

  static async activate(activationUUID) {
    const user = await UserModel.findOne({ activationUUID });

    if (!user) throw ApiError.BadRequest('Некорректная ссылка активации');
    if (user.isActivated)
      throw ApiError.BadRequest('Пользователь уже активирован!');

    user.isActivated = true;
    await user.save();
  }

  static async login(email, password) {
    const user = await UserModel.findOne({ email });
    if (!user) throw ApiError.BadRequest('Такого пользователя не существует!');

    const isPassEquals = await bcrypt.compare(password, user.passwordHashed);
    if (!isPassEquals) throw ApiError.BadRequest('Некорректный пароль!');

    return await Tokens.registerUserTokens(user);
  }

  static async logout(refreshToken) {
    const token = await Tokens.removeRefreshToken(refreshToken);
    return token;
  }

  static async refresh(refreshToken) {
    if (!refreshToken) throw ApiError.Unauthorized();

    const validationData = await Tokens.validateRefreshToken(refreshToken);
    if (!validationData) throw ApiError.Unauthorized();

    return await Tokens.registerUserTokens(validationData.user);
  }

  static async getAllUsers() {
    return await UserModel.find();
  }
}

module.exports = UserService;
