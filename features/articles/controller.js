const ArticleService = require('./service');
const { ResponseMessage } = require('../utils');

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

      return res.json(
        ResponseMessage('Статья успешно добавлена!', { articleID: newArticle._id })
      );
    } catch (e) {
      next(e);
    }
  }

  static async delete(req, res, next) {
    try {
      await ArticleService.delete(req.body.articleID, req.user._id);
      return res.json(ResponseMessage('Статья успешно удалена!'));
    } catch (e) {
      next(e);
    }
  }
}

module.exports = ArticleController;

function parseProjection(projection) {
  let projectionArr;

  try {
    projectionArr = JSON.parse(projection);
  } catch (e) {
    return;
  }

  if (!Array.isArray(projectionArr)) return;

  let projectionObject = {};

  for (let key of projectionArr) {
    projectionObject[key] = 1;
  }

  return projectionObject;
}
