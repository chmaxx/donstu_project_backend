const ArticleSchema = require('./model');
const UserSchema = require('../users/userModel');
const ApiError = require('../../middlewares/ApiErrorException');

class ArticleService {
  async get(filter) {
    let code, response_contents;

    try {
      response_contents = await ArticleSchema.find(filter);
      code = 200;
    } catch (e) {
      response_contents = { msg: err.message };
      code = 500;
    }

    return [code, response_contents];
  }

  async create(header, author_id, contents, description, tags = ['Прочее']) {
    let code, response_contents;
    let currentDate = new Date();

    const userExists = await UserSchema.findById(author_id);

    if (!userExists) {
      throw ApiError.Unauthorized();
    }

    const new_article = new ArticleSchema({
      header,
      author_id,
      contents,
      description,
      tags,
      create_time: currentDate,
      last_update_time: currentDate,
    });

    try {
      const savedArticle = await new_article.save();

      response_contents = {
        msg: 'Статья успешно добавлена!',
        created_article_id: savedArticle._id,
      };
      code = 200;
    } catch (e) {
      response_contents = { msg: err.message };
      code = e.code || 500;
    }

    return [code, response_contents];
  }

  async archive(article_id) {
    let code, response_contents;

    try {
      let articleToArchive = await ArticleSchema.findOne({ _id: article_id });

      if (articleToArchive.is_archived)
        throw new TypeError('Статья уже заархивирована!');

      articleToArchive.is_archived = true;
      articleToArchive.save();

      code = 200;
      response_contents = { msg: 'Статья успешно архивирована!' };
    } catch (e) {
      code = err.name === 'TypeError' ? 400 : 500;
      response_contents = { msg: err.message };
    }

    return [code, response_contents];
  }

  async unarchive(article_id) {
    let code, response_contents;

    try {
      let archivedArticle = await ArticleSchema.findOne({ _id: article_id });

      if (archivedArticle.is_archived != true)
        throw new TypeError('Данной статьи нет в архиве!');

      archivedArticle.is_archived = false;
      archivedArticle.save();

      code = 200;
      response_contents = { msg: 'Статья успешно удалена из архива!' };
    } catch (e) {
      code = err.name === 'TypeError' ? 400 : 500;
      response_contents = { msg: err.message };
    }

    return [code, response_contents];
  }
}

module.exports = new ArticleService();
