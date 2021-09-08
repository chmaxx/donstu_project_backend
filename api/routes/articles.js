/* Маршрут Articles
 * Отвечает за CRUD-операции, связанные с статьями 
 * прим.: пока доступны не все операции :)
 */

const Article   = require('../schemas/articles');
const {Router}  = require('express');
const router    = Router();

// Функция для проверки аргумента на формат JSON
// https://stackoverflow.com/questions/9804777/how-to-test-if-a-string-is-json-or-not/33369954#33369954
function isJSON(item) {
    item = typeof item !== "string"
        ? JSON.stringify(item)
        : item;

    try {
      item = JSON.parse(item);
    } catch (e) {
      return false;
    }

    if (typeof item === "object" && item !== null) {
      return true;
    }

    return false;
}

/* Функционал парсинга контента, получаемого от пользователей
 * При любой неудаче возвращает fallbackContent
 */
const fallbackContent = [
  {
    type: "markdown",
    value: "У данной статьи нет содержимого!"
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
const fallbackTags = ["Ошибка при обработке"]
function parseTags(tagsData, fallbackTo) {
  // Fallback-контент по умолчанию
  // TODO: есть более адекватный способ установки значения по умолчанию?
  fallbackTo = fallbackTo !== undefined ? fallbackTo : fallbackTags;

  if (!isJSON(tagsData)) return fallbackTags; 

  console.log(tagsData)

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

router.get('/', (req, res) => {
  if (api_config && !api_config.db_settings.enabled) {
    res.status(500).json({"msg": "База данных отключена!"});
    return;      
  };

  var filter = {};

  console.log(isJSON(req.body.filters));

  // Пользовательские фильтры
  if (req.body.filters && isJSON(req.body.filters)) {
    var req_filters = JSON.parse(req.body.filters);
    
    // Конкретный автор
    if (req_filters.author_id) filter.author_id = req_filters.author_id;

    console.log(req_filters);
    
    // Наличие определенных тегов
    if (req_filters.tags) filter.tags = req_filters.tags;
    
    // Временные рамки (создание)
    // Должно быть списком с двумя значениями: начало-конец
    if (req_filters.date_interval) {
      filter.create_time = {
        "$gte": req_filters.date_interval[0], 
        "$lte": req_filters.date_interval[1] ? req_filters.date_interval[1] : new Date()};
    };
  };

  console.log(filter);

  Article.find(filter, (err, docs) => {
    if (err) {
      res.status(500).json({"msg": "Ошибка при получении списка статей: " + err});
      return; 
    };

    res.status(200).json(docs);
  });
});

router.post('/add', (req, res) => {
  if (api_config && !api_config.db_settings.enabled) {
    res.status(500).json({"msg": "База данных отключена!"});
    return;      
  };

  if (!req.body.name) { 
    res.status(400).json({"msg": "Необходимо ввести название статьи!"});
    return;  
  };
  
  if (!req.body.author) {
    res.status(400).json({"msg": "У статьи должен быть автор!"});
    return;
  };

  var contents = parseContents(req.body.contents);
  var tags = parseTags(req.body.tags);
  var currentDate = new Date();

  const new_article = new Article({
    header            : req.body.name, 
    author_id         : req.body.author, 
    contents          : contents, 
    tags              : tags,
    create_time       : currentDate, 
    last_update_time  : currentDate
  });

  new_article.save()
    .then((doc) => {
      console.log('Создана новая статья: ' + doc.header);
      res.status(200).json({"msg": "Статья добавлена!"});
    })
    .catch((err) => {
      console.log('Ошибка при создании статьи: ' + err);
      res.status(500).json({"msg": err});
    });
});

module.exports = router;
