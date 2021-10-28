const bcrypt = require('bcrypt');
const uuid = require('uuid');

const UserModel = require('./userModel');
const MailService = require('../../middlewares/Mailer');
const TokenService = require('./tokenService');
const UserDto = require('./userDTO');
const ApiError = require('../../middlewares/ApiErrorException');

class UserService {
  async registration(nickname, email, password) {
    const candidate = await UserModel.findOne({ email });

    if (candidate) {
      throw ApiError.BadRequest(
        `Пользователь с почтой ${email} уже существует!`
      );
    }

    const activationUUID = uuid.v4();
    const passwordHashed = await bcrypt.hash(password, 3);

    const user = await UserModel.create({
      nickname,
      email,
      passwordHashed,
      activationUUID,
    });

    // TODO: генерацию ссылки по данным из конфига желательно вынести в отдельный middleware
    await MailService.sendActivationMail(
      email,
      `localhost:${api_config.port}/${api_config.api_version}/users/activate/${activationUUID}`
    );

    const userDto = new UserDto(user);
    const tokens = TokenService.generateTokens({ ...userDto });
    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async activate(activationUUID) {
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

  async login(email, password) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest('Такого пользователя не существует!');
    }

    const isPassEquals = await bcrypt.compare(password, user.passwordHashed);

    if (!isPassEquals) {
      throw ApiError.BadRequest('Некорректный пароль!');
    }

    const userDto = new UserDto(user);
    const tokens = TokenService.generateTokens({ ...userDto });
    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async logout(refreshToken) {
    const token = await TokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.Unauthorized();
    }

    const userData = TokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await TokenService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      // TODO: возможно, здесь не Unauthorized-случай?
      throw ApiError.Unauthorized();
    }

    const user = await UserModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = TokenService.generateTokens({ ...userDto });
    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async getAllUsers() {
    const users = await UserModel.find();
    return users;
  }
}

module.exports = new UserService();
