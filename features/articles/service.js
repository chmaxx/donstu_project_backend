const ArticleModel = require('./model');
const ApiError = require('../../lib/ApiError');
const isMongoId = require('../../node_modules/validator/lib/isMongoId');

class ArticleService {
  static async get(filter = {}, projection = {}) {
    // TODO: authorID возвращается независимо от того, есть ли он в проекции
    return await ArticleModel.find(filter, projection).populate('authorID', [
      'firstName',
      'lastName',
      'avatar',
    ]);
  }

  static async getById(articleId) {
    if (!isMongoId(articleId)) throw ApiError.BadRequest('Неверный ID статьи!');

    const article = await ArticleModel.findById(articleId);
    if (!article) throw ApiError.BadRequest('Данной статьи не существует!');

    return article;
  }

  static async add(header, authorID, contents, description, thumbnailURL, tags) {
    const curTime = new Date();

    tags = JSON.parse(tags);
    if (!Array.isArray(tags)) throw ApiError.BadRequest('Теги должны быть массивом!');

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

  static async update(articleID, updates) {
    const article = await ArticleModel.findById(articleID);

    if (!article) throw ApiError.BadRequest('Данной статьи не существует!');

    for (const [path, updateValue] of Object.entries(updates)) {
      /* ArticleModel.schema.paths содержит в себе данные всех ключей,
       * которые есть в модели
       */
      const articlePath = ArticleModel.schema.paths[path];
      if (!articlePath) throw ApiError.BadRequest(`У статей нет ключа ${path}!`);

      if (typeof updateValue !== articlePath.instance.toLowerCase())
        throw ApiError.BadRequest(`Тип ${path} не совпадает с тем, что указан в схеме!`);

      article[path] = updateValue;
    }

    // TODO: вынести это куда-нибудь в мидлвари Mongoose-схем
    article.lastUpdateTime = new Date();
    await article.save();
  }

  static async delete(articleID, authorID) {
    const article = await ArticleModel.findById(articleID, { authorID: 1 });

    if (!article) throw ApiError.BadRequest('Данной статьи не существует!');

    if (!article.authorID.equals(authorID))
      throw ApiError.BadRequest('Вы не являетесь автором данной статьи!');

    await article.delete();
  }
}

module.exports = ArticleService;
