const jwt = require('jsonwebtoken');
const TokenSchema = require('./model');
const UserDTO = require('../user/dto');

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

  static validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, api_config.jwt.access_token_secret);
      return userData;
    } catch (e) {
      return null;
    }
  }

  static validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, api_config.jwt.refresh_token_secret);
      return userData;
    } catch (e) {
      return null;
    }
  }

  static async saveRefreshToken(user, refreshToken) {
    const tokenData = await TokenSchema.findOne({ user });

    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return await tokenData.save();
    }

    const token = await TokenSchema.create({ user, refreshToken });

    return token;
  }

  static async removeRefreshToken(refreshToken) {
    return await TokenSchema.deleteOne({ refreshToken });
  }

  static async getRefreshToken(refreshToken) {
    return await TokenSchema.findOne({ refreshToken });
  }
}

module.exports = Tokens;
