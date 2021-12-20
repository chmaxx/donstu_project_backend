const bcrypt = require('bcrypt');
const uuid = require('uuid');

const UserModel = require('./user/model');
const UploadModel = require('../../lib/Uploader/model');
const MailService = require('../../lib/Mailer');
const Tokens = require('./tokens');
const ApiError = require('../../lib/ApiError');

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
      `localhost:${API_CONFIG.port}/${API_CONFIG.api_version}/users/activate/${activationUUID}`
    );

    return Tokens.registerUserTokens(user);
  }

  static async activate(activationUUID) {
    const user = await UserModel.findOne({ activationUUID });

    if (!user) throw ApiError.BadRequest('Некорректная ссылка активации');
    if (user.isActivated) throw ApiError.BadRequest('Пользователь уже активирован!');

    user.isActivated = true;
    await user.save();
  }

  static async login(email, password) {
    const user = await UserModel.findOne({ email });
    if (!user) throw ApiError.BadRequest('Такого пользователя не существует!');

    const isPassEquals = await bcrypt.compare(password, user.passwordHashed);
    if (!isPassEquals) throw ApiError.BadRequest('Некорректный пароль!');

    return Tokens.registerUserTokens(user);
  }

  static async logout(refreshToken) {
    return Tokens.removeRefreshToken(refreshToken);
  }

  static async changePassword(userId, oldPassword, newPassword) {
    if (oldPassword == newPassword)
      throw ApiError.BadRequest('Новый пароль не может совпадать со старым!');

    const user = await UserModel.findById(userId);
    const isPassEquals = await bcrypt.compare(oldPassword, user.passwordHashed);

    if (!isPassEquals) throw ApiError.BadRequest('Неправильный старый пароль!');

    user.passwordHashed = await bcrypt.hash(newPassword, 3);
    await user.save();

    return Tokens.registerUserTokens(user);
  }

  static async changeAvatar(userId, uploadId) {
    const user = await UserModel.findById(userId);
    const upload = await UploadModel.findById(uploadId);

    if (!upload) throw ApiError.BadRequest('Данного файла не существует!');

    user.avatar = upload._id;
    await user.save();
  }

  static async getInfo(userId) {
    const user = await UserModel.findById(userId, {
      firstName: 1,
      lastName: 1,
      login: 1,
      usergroup: 1,
      avatarUploadId: 1,
    });

    if (!user) throw ApiError.BadRequest('Такого пользователя не существует!');

    return user;
  }

  static async refresh(refreshToken) {
    if (!refreshToken) throw ApiError.Unauthorized();

    const validationData = await Tokens.validateRefreshToken(refreshToken);
    if (!validationData) throw ApiError.Unauthorized();

    return Tokens.registerUserTokens(validationData.user);
  }

  // дубликат ArticleService.update (почти)
  static async changeUserInfo(userId, updates) {
    const user = await UserModel.findById(userId);

    if (!user) throw ApiError.BadRequest('Данного пользователя не существует!');

    for (const [path, updateValue] of Object.entries(updates)) {
      const userPath = UserModel.schema.paths[path];
      if (!userPath) throw ApiError.BadRequest(`У пользователей нет ключа ${path}!`);

      if (typeof updateValue !== userPath.instance.toLowerCase())
        throw ApiError.BadRequest(`Тип ${path} не совпадает с тем, что указан в схеме!`);

      user[path] = updateValue;
    }

    await user.save();
  }
}

module.exports = UserService;
