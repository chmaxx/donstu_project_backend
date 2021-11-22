const ArticleModel = require('./model');
const ApiError = require('../../middlewares/ApiErrorException');

class ArticleService {
  static async get(filter = undefined, returnKeys = undefined) {
    return await ArticleModel.find();
  }

  static async add(header, authorID, contents, description, thumbnailURL, tags) {
    const curTime = new Date();

    const article = new ArticleModel({
      header,
      authorID,
      contents,
      description,
      thumbnailURL,
      tags,
      createTime: curTime,
      lastUpdateTime: curTime,
    });

    return await article.save();
  }

  static async delete(articleID, authorID) {
    const article = await ArticleModel.findById(articleID);

    if (!article) throw ApiError.BadRequest('Данной статьи не существует!');

    if (!article.authorID.equals(authorID))
      throw ApiError.BadRequest('Вы не являетесь автором данной статьи!');

    await article.delete();
  }
}

module.exports = ArticleService;
