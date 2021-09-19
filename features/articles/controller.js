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
            if (api_config && !api_config.db_settings.enabled) {
                return res.status(500).json({msg: 'База данных отключена!'});      
            }
            
            if (!req.body.name) { 
                return res.status(400).json({msg: 'Необходимо ввести название статьи!'});  
            }
            
            // Это необязательный аргумент, поэтому ничего плохого не произойдет, если мы передадим это в функцию
            var content_type;
             
            if (req.body.content_type && typeof req.body.content_type === 'string') 
                content_type = req.body.content_type;
            
            const [code, response_contents] = await ArticleService.create(
                req.body.name, // header
                req.body.author || 'system', // author
                parseContents(req.body.contents), // contents 
                parseTags(req.body.tags), // tags
                content_type // content_type
            );
            
            res.status(code).json(response_contents);
        } catch (e) {
            next(e);
        }
    }

    async archive(req, res, next) {
        try {
            if (api_config && !api_config.db_settings.enabled) {
                return res.status(500).json({msg: 'База данных отключена!'});
            }
            
            if (!req.body.article_id) {
                return res.status(400).json({msg: 'Необходимо ввести ID статьи!'}); 
            }
            
            var [code, response_contents] = await ArticleService.archive(req.body.article_id);
            res.status(code).json(response_contents);
        } catch (e) {
            next(e);
        }
    }

    async unarchive(req, res, next) {
        try {
            if (api_config && !api_config.db_settings.enabled) {
                return res.status(500).json({msg: 'База данных отключена!'});    
            }  
            
            if (!req.body.article_id) {
                return res.status(400).json({msg: 'Необходимо ввести ID статьи!'});  
            }
            
            var [code, response_contents] = await ArticleService.unarchive(req.body.article_id);
            res.status(code).json(response_contents);
        } catch (e) {
            next(e);
        }
    }
}


/* Функционал парсинга контента, получаемого от пользователей
 * При любой неудаче возвращает fallbackContent
 */
const fallbackContent = [
    {
      type: 'markdown',
      value: 'У данной статьи нет содержимого!'
    }
]; 
function parseContents(contentData, fallbackTo = fallbackContent) {
    if (!isJSON(contentData)) return fallbackContent; 
  
    var json_content;
    try {
        json_content = JSON.parse(contentData);
    } catch (e) {
        json_content = fallbackContent;
    }
  
    // Если после блока try-catch не удалось спарсить аргумент
    // (при таком сценарии fallbackContent и json_content - одно и тоже)
    if (fallbackContent == json_content) return fallbackContent;

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
