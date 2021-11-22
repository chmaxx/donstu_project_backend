const ArticleModel = require('./model');
const UserModel = require('../users/user/model');
const ApiError = require('../../middlewares/ApiErrorException');

class ArticleService {
  async get(filter) {
    let code, response_contents;

    try {
      response_contents = await ArticleModel.find(filter);
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

    const userExists = await UserModel.findById(author_id);

    if (!userExists) {
      throw ApiError.Unauthorized();
    }

    const new_article = new ArticleModel({
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
}

module.exports = new ArticleService();
