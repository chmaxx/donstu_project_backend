/* Все, что нужно для работы со статьями 
 * Я решил оставить обработку входных данных в роутах, чтобы эти функции в будущем можно было
 * использовать где-то за границами роутов 
 */ 

const Article   = require('./schema');

/* Все функции будут возвращать массив, где первое значение ВСЕГДА html-статус, а последующие 
 * будут уникальны для каждой функции (но зачастую это будут обьекты, которые будут передаваться сразу клиенту)
 */

/* Для реализации всей этой балды мне пришлось прибегнуть к использованию async/await (и try..catch)
 * Обязательно ли это?
 */

// Получение статей
module.exports.get = async (filters) => {
	let code, response_contents;

  try {
    response_contents = await Article.find(filters);
    code = 200;
  } 
  catch(err) {
    response_contents = {msg: err.message};
    code = 500; 
  };

  return [code, response_contents];
}

// Создание статьи
module.exports.create = async (header, author, contents, tags, content_type) => {
  let code, response_contents;
	let currentDate = new Date();

  const new_article = new Article({
    header            : header, 
    author_id         : author, 
    contents          : contents, 
    tags              : tags,
    create_time       : currentDate, 
    last_update_time  : currentDate
  });	

  try {
    let savedArticle = await new_article.save(); 
    
    response_contents = {msg: 'Статья успешно добавлена!', created_article_id: savedArticle._id};
    code = 200;
  } 
  catch (err) {
    response_contents = {msg: err.message};
    code = 500;
  };

  return [code, response_contents];
}

// Архивирование статьи
module.exports.archive = async (article_id) => {
  let code, response_contents;

  try {
    let articleToArchive = await Article.findOne({_id: article_id}); 

    // Единственный известный мне способ принудительно выйти из try..catch, сохраняя нужный мне функционал - вызвать ошибку
    // но корректно ли в данном случае вызывать именно TypeError? 
    if (articleToArchive.is_archived) throw new TypeError('Статья уже заархивирована!');

    articleToArchive.is_archived = true; 
    articleToArchive.save(); 

    code = 200;
    response_contents = {msg: 'Статья успешно архивирована!'};
  } 
  catch(err) {
    code = err.name === 'TypeError' ? 400 : 500; 
    response_contents = {msg: err.message};
  };

  return [code, response_contents];
}

// Удаление статьи из архива
module.exports.unarchive = async (article_id) => {
  let code, response_contents; 

  try {
    let archivedArticle = await Article.findOne({_id: article_id});

    // Статья не заархивирована
    // проблема TypeError обсуждена выше 
    if (archivedArticle.is_archived != true) throw new TypeError('Данной статьи нет в архиве!');

    archivedArticle.is_archived = false; 
    archivedArticle.save();    

    code = 200;
    response_contents = {msg: 'Статья успешно удалена из архива!'};
  }
  catch (err) {
    code = err.name === 'TypeError' ? 400 : 500; 
    response_contents = {msg: err.message};
  }

  return [code, response_contents];
}
