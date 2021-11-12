const jwt = require('jsonwebtoken');
const TokenModel = require('./model');
const UserModel = require('../user/model');
const UserDTO = require('../user/dto');
const { ObjectId } = require('bson');

// Небольшая функция для быстрой генерации токена с нужными настройками
const createToken = (payload, kind) => {
  return jwt.sign(payload, api_config.jwt[`${kind}_token_secret`], {
    expiresIn: api_config.jwt[`${kind}_token_lifetime`],
  });
};

class Tokens {
  static generateTokens(payload) {
    const accessToken = createToken(payload, 'access');
    const refreshToken = createToken(payload, 'refresh');

    return { accessToken, refreshToken };
  }

  static async registerUserTokens(userModel) {
    const defaultUserDTO = UserDTO.Default(userModel);
    const tokens = Tokens.generateTokens(defaultUserDTO);
    await Tokens.saveRefreshToken(defaultUserDTO.id, tokens.refreshToken);

    return {
      ...tokens,
      user: defaultUserDTO,
    };
  }

  static async validateAccessToken(token) {
    try {
      const jwtData = jwt.verify(token, api_config.jwt.access_token_secret);
      if (!jwtData) return null;

      const userData = await UserModel.findById(jwtData.id);
      if (!userData) return null;

      return { jwt: jwtData, user: userData };
    } catch (e) {
      return null;
    }
  }

  static async validateRefreshToken(token) {
    try {
      const jwtData = jwt.verify(token, api_config.jwt.refresh_token_secret);
      if (!jwtData) return null;

      const userData = await TokenModel.findOne({
        user: new ObjectId(jwtData.id),
      });
      if (!userData) return null;

      return { jwt: jwtData, user: userData };
    } catch (e) {
      return null;
    }
  }

  static async saveRefreshToken(user, refreshToken) {
    const tokenData = await TokenModel.findOne({ user });

    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return await tokenData.save();
    }

    const token = await TokenModel.create({ user, refreshToken });

    return token;
  }

  static async removeRefreshToken(refreshToken) {
    return await TokenModel.deleteOne({ refreshToken });
  }

  static async getRefreshToken(refreshToken) {
    return await TokenModel.findOne({ refreshToken });
  }
}

module.exports = Tokens;
