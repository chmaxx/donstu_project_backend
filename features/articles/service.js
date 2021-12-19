const ArticleModel = require('./model');
const ApiError = require('../../lib/ApiError');
const isMongoId = require('../../node_modules/validator/lib/isMongoId');

class ArticleService {
  static async get(filter = {}, projection = {}) {
    // TODO: authorId возвращается независимо от того, есть ли он в проекции
    return await ArticleModel.find(filter, projection).populate('authorId', [
      'firstName',
      'lastName',
      'avatar',
    ]);
  }

  static async getById(articleId) {
    if (!isMongoId(articleId)) throw ApiError.BadRequest('Неверный Id статьи!');

    const article = await ArticleModel.findById(articleId).populate('authorId', [
      'firstName',
      'lastName',
      'avatar',
    ]);

    if (!article) throw ApiError.BadRequest('Данной статьи не существует!');

    return article;
  }

  static async add(ability, header, authorId, contents, description, thumbnailURL, tags) {
    if (ability.cannot('write', 'Article')) {
      throw ApiError.Forbidden('У Вас недостаточно прав для публикования статей!');
    }

    const curTime = new Date();

    tags = JSON.parse(tags);
    if (!Array.isArray(tags)) throw ApiError.BadRequest('Теги должны быть массивом!');

    const article = new ArticleModel({
      header,
      authorId,
      contents,
      description,
      thumbnailURL,
      tags,
      createTime: curTime,
      lastUpdateTime: curTime,
    });

    return await article.save();
  }

  static async update(ability, articleId, updates) {
    const article = await ArticleModel.findById(articleId);

    if (!article) throw ApiError.BadRequest('Данной статьи не существует!');

    if (ability.cannot('update', article)) {
      throw ApiError.Forbidden('У Вас недостаточно прав для редактирования этой статьи!');
    }

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

  static async delete(ability, articleId, authorId) {
    const article = await ArticleModel.findById(articleId, { authorId: 1 });

    if (!article) throw ApiError.BadRequest('Данной статьи не существует!');

    if (ability.cannot('delete', article)) {
      throw ApiError.Forbidden('У Вас недостаточно прав для удаления этой статьи!');
    }

    await article.delete();
  }
}

module.exports = ArticleService;
