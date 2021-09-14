/* Маршрут Articles
 * Отвечает за CRUD-операции, связанные с статьями 
 * прим.: пока доступны не все операции :)
 */

const article_controller = require('./controller'); 
//const Article   = require('./schema');
const {Router}  = require( 'express');
const {isJSON}  = require('../utils');
const router    = Router();

// Функция для проверки аргумента на формат JSON
// https://stackoverflow.com/questions/9804777/how-to-test-if-a-string-is-json-or-not/33369954#33369954


/* Функционал парсинга контента, получаемого от пользователей
 * При любой неудаче возвращает fallbackContent
 */
const fallbackContent = [
  {
    type: 'markdown',
    value: 'У данной статьи нет содержимого!'
  }
]; 
function parseContents(contentData, fallbackTo) {
  // Fallback-контент по умолчанию
  // TODO: есть более адекватный способ установки значения по умолчанию?
  fallbackTo = fallbackTo !== undefined ? fallbackTo : fallbackContent;

  // Если не удается привести contentData к JSON, сходу возвращаем fallbackContent
  if (!isJSON(contentData)) return fallbackContent; 

  // Пытаемся спарсить JSON из входных данных. Если не получается - присваиваем fallbackContent
  var json_content;
  try 
    {
      json_content = JSON.parse(contentData);
    } 
  catch (err) 
    {
      json_content = fallbackContent;
    }

  // Если после блока try-catch не удалось спарсить аргумент
  // (при таком сценарии fallbackContent и json_content - одно и тоже)
  if (fallbackContent == json_content) return fallbackContent;

  // Если после парсинга получили пустой массив
  if (json_content.length == 0) return fallbackContent;

  for (var i = 0; i < json_content.length; i++) {
    var content_row = contentData[i];
    // Если в одной из ячеек с контентом не указан тип контента - удаляем ее 
    if (!content_row.type) {
      delete(contentData[i]);
      continue;
    };
  };

  return json_content;
}

/* Функционал парсинга тегов, получаемых от пользователей
 * При любой неудаче возвращает fallbackTags
 */
const fallbackTags = ['Ошибка при обработке']
function parseTags(tagsData, fallbackTo) {
  // Fallback-контент по умолчанию
  // TODO: есть более адекватный способ установки значения по умолчанию?
  fallbackTo = fallbackTo !== undefined ? fallbackTo : fallbackTags;

  if (!isJSON(tagsData)) return fallbackTags; 

  // Пытаемся спарсить входные данные. Не получается - присваиваем fallbackTags
  var json_tags; 
  try
    {
      json_tags = JSON.parse(tagsData);
    }
  catch (err)
    {
      json_tags = fallbackTags;
    }

  // Если после блока try-catch не удалось спарсить аргумент
  // (при таком сценарии fallbackTags и json_tags - одно и тоже)
  if (json_tags == fallbackTags) return fallbackTags; 

  // Если на выходе получили пустой массив
  if (json_tags.length == 0) return fallbackTags;

  // Приводим все теги к типу String;
  for (var i = 0; i < json_tags.length; i++) {
    var tag = json_tags[i];
    if (typeof tag !== 'string') json_tags[i] = tag.toString();
  }

  return json_tags;
}

/* Реализация получения статей */

router.get('/', async (req, res) => {
  if (api_config && !api_config.db_settings.enabled) {
    res.status(500).json({msg: 'База данных отключена!'});
    return;      
  };

  var filter = {};

  /* Убираем из выдачи все архивированные статьи
   * Поскольку функционал архивирования добавлен недавно, у некоторых статей в базе данных может не быть этого поля,
   * поэтому стоит добавить флаг $ne
   */
  filter.is_archived = {'$ne': true}; 

  /* Пользовательские фильтры
   * Мы могли бы обойтись без этого куска кода, просто присваивая filter = req.body.filters,
   * но я решил немного запороться и сделать 'небольшую проверку входных данных
   */
  if (req.body.filters && isJSON(req.body.filters)) {
    var req_filters = JSON.parse(req.body.filters);
    
    // Конкретный автор
    if (req_filters.author_id) filter.author_id = req_filters.author_id;

    // Наличие определенных тегов
    if (req_filters.tags) filter.tags = req_filters.tags;

    // Тип контента
    if (req_filters.content_type) filter.content_type = content_type;
    
    // Временные рамки (создание)
    // Должно быть списком с двумя значениями: начало-конец
    if (req_filters.date_interval) {
      filter.create_time = {
        '$gte': req_filters.date_interval[0], 
        '$lte': req_filters.date_interval[1] ? req_filters.date_interval[1] : new Date()};
    };
  };

  var [code, response_contents] = await article_controller.get(filter);
  res.status(code).json(response_contents);
});

/* Реализация добавления статей */

router.post('/add', async (req, res) => {
  if (api_config && !api_config.db_settings.enabled) {
    res.status(500).json({msg: 'База данных отключена!'});
    return;      
  };

  if (!req.body.name) { 
    res.status(400).json({msg: 'Необходимо ввести название статьи!'});
    return;  
  };
  
  /* По умолчанию автор всех постов - system
   * if (!req.body.author) {
   *   res.status(400).json({'msg': 'У статьи должен быть автор!'});
   *   return;
   * };
   */

  // Это необязательный аргумент, поэтому ничего плохого не произойдет, если мы передадим это в функцию
  var content_type;
 
  if (req.body.content_type && typeof req.body.content_type === 'string') 
    content_type = req.body.content_type;

  var [code, response_contents] = await article_controller.create(
      req.body.name, // header
      req.body.author !== undefined ? req.body.author : 'system', // author
      parseContents(req.body.contents), // contents 
      parseTags(req.body.tags), // tags
      content_type // content_type
    );
  res.status(code).json(response_contents);
});

/* Реализация архивации статей */

router.post('/archive', async (req, res) => {
  if (api_config && !api_config.db_settings.enabled) {
    res.status(500).json({msg: 'База данных отключена!'});
    return;      
  };  

  if (!req.body.article_id) {
    res.status(400).json({msg: 'Необходимо ввести ID статьи!'});
    return;      
  };

  var [code, response_contents] = await article_controller.archive(req.body.article_id);
  res.status(code).json(response_contents);
})

/* Реализация удаления статей из архива */

router.post('/unarchive', async (req, res) => {
  if (api_config && !api_config.db_settings.enabled) {
    res.status(500).json({msg: 'База данных отключена!'});
    return;      
  };  

  if (!req.body.article_id) {
    res.status(400).json({msg: 'Необходимо ввести ID статьи!'});
    return;      
  };

  var [code, response_contents] = await article_controller.unarchive(req.body.article_id);
  res.status(code).json(response_contents);
})

module.exports = router;