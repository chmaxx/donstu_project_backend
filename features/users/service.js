const bcrypt = require('bcrypt');
const uuid = require('uuid');

const UserModel = require('./user/model');
const MailService = require('../../lib/Mailer');
const Tokens = require('./tokens');
const UserDTO = require('./user/dto');
const ApiError = require('../../middlewares/ApiErrorException');

class UserService {
  static async registration(login, firstName, lastName, email, password) {
    // TODO: сделать нормально
    const candidate = await UserModel.findOne({ email });

    if (candidate) {
      throw ApiError.BadRequest('Пользователь с такой почтой уже существует!');
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

    const defaultUserDTO = UserDTO.Default(user);
    const tokens = Tokens.generateTokens(defaultUserDTO);
    await Tokens.saveToken(defaultUserDTO.id, tokens.refreshToken);

    return {
      ...tokens,
      user: defaultUserDTO,
    };
  }

  static async activate(activationUUID) {
    const user = await UserModel.findOne({ activationUUID });

    if (!user) {
      throw ApiError.BadRequest('Некорректная ссылка активации');
    }

    if (user.isActivated) {
      throw ApiError.BadRequest('Пользователь уже активирован!');
    }

    user.isActivated = true;
    await user.save();
  }

  static async login(email, password) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest('Такого пользователя не существует!');
    }

    const isPassEquals = await bcrypt.compare(password, user.passwordHashed);

    if (!isPassEquals) {
      throw ApiError.BadRequest('Некорректный пароль!');
    }

    const defaultUserDTO = UserDTO.Default(user);
    const tokens = Tokens.generateTokens(defaultUserDTO);
    await Tokens.saveToken(defaultUserDTO.id, tokens.refreshToken);

    return {
      ...tokens,
      user: defaultUserDTO,
    };
  }

  static async logout(refreshToken) {
    const token = await Tokens.removeToken(refreshToken);
    return token;
  }

  static async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.Unauthorized();
    }

    const userData = Tokens.validateRefreshToken(refreshToken);
    const tokenFromDb = await Tokens.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      // TODO: возможно, здесь не Unauthorized-случай?
      throw ApiError.Unauthorized();
    }

    const user = await UserModel.findById(userData.id);
    const defaultUserDTO = UserDTO.Default(user);
    const tokens = Tokens.generateTokens(defaultUserDTO);
    await Tokens.saveToken(defaultUserDTO.id, tokens.refreshToken);

    return {
      ...tokens,
      user: defaultUserDTO,
    };
  }

  static async getAllUsers() {
    const users = await UserModel.find();
    return users;
  }
}

module.exports = UserService;
