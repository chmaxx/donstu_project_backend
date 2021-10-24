const {isJSON}  = require('../utils');
const ArticleService = require('./service');

class ArticleController {
    async get(req, res, next) {
        try {
            let filter = {};
           
            /* Убираем из выдачи все архивированные статьи
            * Поскольку функционал архивирования добавлен недавно, у некоторых статей в базе данных может не быть этого поля,
            * поэтому стоит добавить флаг $ne
            */
            filter.is_archived = {$ne: true}; 

            // Пользовательские фильтры
            if (req.body.filters && isJSON(req.body.filters)) {
                const req_filters = JSON.parse(req.body.filters);
    
                if (req_filters.author_id) filter.author_id = req_filters.author_id;
                if (req_filters.tags) filter.tags = req_filters.tags;
                if (req_filters.content_type) filter.content_type = content_type;
                
                // Временные рамки (создание)
                // Должно быть списком с двумя значениями: начало-конец (по умолчанию конец - текущее время)
                if (req_filters.date_interval) {
                    filter.create_time = {
                    $gte: req_filters.date_interval[0], 
                    $lte: req_filters.date_interval[1] ? req_filters.date_interval[1] : new Date()};
                }
            }

            const [code, response_contents] = await ArticleService.get(filter);
            return res.status(code).json(response_contents);            
        } catch (e) {

        }
    }

    async add(req, res, next) {
        try {           
            const [code, response_contents] = await ArticleService.create(
                req.body.name, // header
                req.user.id, // author
                req.body.contents, // contents 
                req.body.description, // description
                parseTags(req.body.tags) // tags
            );
            
            res.status(code).json(response_contents);
        } catch (e) {
            next(e);
        }
    }

    async archive(req, res, next) {
        try {        
            var [code, response_contents] = await ArticleService.archive(req.body.article_id);
            res.status(code).json(response_contents);
        } catch (e) {
            next(e);
        }
    }

    async unarchive(req, res, next) {
        try {           
            var [code, response_contents] = await ArticleService.unarchive(req.body.article_id);
            res.status(code).json(response_contents);
        } catch (e) {
            next(e);
        }
    }
}

/* Функционал парсинга тегов, получаемых от пользователей
 * При любой неудаче возвращает fallbackTags
 */
const fallbackTags = ['Ошибка при обработке']
function parseTags(tagsData, fallbackTo = fallbackTags) {
    if (!isJSON(tagsData)) return fallbackTags; 
  
    var json_tags; 
    try {
        json_tags = JSON.parse(tagsData);
    } catch (e) {
        json_tags = fallbackTags;
    }
  
    // Если после блока try-catch не удалось спарсить аргумент
    // (при таком сценарии fallbackTags и json_tags - одно и тоже)
    if (json_tags == fallbackTags) return fallbackTags; 
  
    if (json_tags.length == 0) return fallbackTags;
  
    // Приводим все теги к типу String;
    for (var i = 0; i < json_tags.length; i++) {
      var tag = json_tags[i];
      if (typeof tag !== 'string') json_tags[i] = tag.toString();
    }
  
    return json_tags;
}  

module.exports = new ArticleController;
