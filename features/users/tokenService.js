const jwt = require('jsonwebtoken');
const TokenSchema = require('./tokenModel');

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, api_config.jwt.access_token_secret, {
      expiresIn: api_config.jwt.access_token_lifetime,
    });
    const refreshToken = jwt.sign(
      payload,
      api_config.jwt.refresh_token_secret,
      {
        expiresIn: api_config.jwt.refresh_token_lifetime,
      }
    );

    return { accessToken, refreshToken };
  }

  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, api_config.jwt.access_token_secret);
      return userData;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, api_config.jwt.refresh_token_secret);
      return userData;
    } catch (e) {
      return null;
    }
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await TokenSchema.findOne({ user: userId });

    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }

    const token = await TokenSchema.create({ user: userId, refreshToken });

    return token;
  }

  async removeToken(refreshToken) {
    const tokenData = await TokenSchema.deleteOne({ refreshToken });
    return tokenData;
  }

  async findToken(refreshToken) {
    const tokenData = await TokenSchema.findOne({ refreshToken });
    return tokenData;
  }
}

module.exports = new TokenService();
