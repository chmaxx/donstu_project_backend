const ArticleService = require('./service');
const { ResponseMessage, formatUser, formatArticle, parseProjection } = require('../utils');
const ApiError = require('../../middlewares/ApiErrorException');

const Logger = require('log-my-ass');
const log = new Logger(api_config.logger, 'Articles');

class ArticleController {
  static async get(req, res, next) {
    const articles = await ArticleService.get(null, parseProjection(req.body.projection));
    return res.json(articles);
  }

  static async add(req, res, next) {
    const { header, contents, description, thumbnailURL, tags } = req.body;

    try {
      const newArticle = await ArticleService.add(
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
        ResponseMessage('Статья успешно добавлена!', { articleID: newArticle._id })
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

      await ArticleService.update(req.body.articleID, updates);

      log.info(
        `Пользователь ${formatUser(req.user)} обновил статью ${formatArticle(
          req.body.articleID
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
      await ArticleService.delete(req.body.articleID, req.user._id);

      log.info(
        `Пользователь ${formatUser(req.user)} удалил статью ${formatArticle(
          req.body.articleID
        )}`
      );

      return res.json(ResponseMessage('Статья успешно удалена!'));
    } catch (e) {
      next(e);
    }
  }
}

module.exports = ArticleController;
