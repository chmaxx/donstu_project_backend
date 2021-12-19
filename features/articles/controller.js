const ArticleService = require('./service');
const { ResponseMessage, formatUser, formatArticle, parseProjection } = require('../utils');
const ApiError = require('../../lib/ApiError');

const Logger = require('log-my-ass');
const log = new Logger(API_CONFIG.logger, 'Articles');

class ArticleController {
  static async get(req, res, next) {
    const articles = await ArticleService.get(null, parseProjection(req.body.projection));
    return res.json(articles);
  }

  static async getById(req, res, next) {
    try {
      const article = await ArticleService.getById(req.params.id);
      return res.json(article);
    } catch (e) {
      next(e);
    }
  }

  static async add(req, res, next) {
    const { header, contents, description, thumbnailURL, tags } = req.body;

    try {
      const newArticle = await ArticleService.add(
        req.ability,
        header,
        req.user._id,
        contents,
        description,
        thumbnailURL,
        tags
      );

      log.info(
        `Пользователь ${formatUser(req.user)} загрузил статью ${formatArticle(newArticle)}`
      );

      return res.json(
        ResponseMessage('Статья успешно добавлена!', { articleId: newArticle._id })
      );
    } catch (e) {
      next(e);
    }
  }

  static async update(req, res, next) {
    let updates = {};

    try {
      updates = JSON.parse(req.body.updateData);

      if (Array.isArray(updates))
        throw ApiError.BadRequest('Объект обновлений не должен быть массивом!');

      await ArticleService.update(req.ability, req.body.articleId, updates);

      log.info(
        `Пользователь ${formatUser(req.user)} обновил статью ${formatArticle(
          req.body.articleId
        )}
          Обновленные поля: ${Object.keys(updates).join(', ')}`
      );

      return res.json(ResponseMessage('Статья успешно обновлена!'));
    } catch (e) {
      next(e);
    }
  }

  static async delete(req, res, next) {
    try {
      await ArticleService.delete(req.ability, req.body.articleId, req.user._id);

      log.info(
        `Пользователь ${formatUser(req.user)} удалил статью ${formatArticle(
          req.body.articleId
        )}`
      );

      return res.json(ResponseMessage('Статья успешно удалена!'));
    } catch (e) {
      next(e);
    }
  }
}

module.exports = ArticleController;
