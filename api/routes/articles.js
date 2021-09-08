/* Маршрут Articles
 * Отвечает за CRUD-операции, связанные с статьями 
 * прим.: пока доступны не все операции :) (точнее одна)
 */

const Article   = require('../schemas/articles');
const {Router}  = require('express');
const router    = Router();

/*
router.get('/', (req, res) => {
  if (api_config && !api_config.db_settings.enabled) {
    res.status(500).json({"msg": "База данных отключена!"});
    return;      
  }

  Article.findOne((err, doc)  => {
    console.log(err);
    console.log(doc);
    res.json(doc);
  })   
});
*/

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

  // TODO: привести к адекватному виду
  var contents = req.body.contents ?
    // если контент указан в теле - используем его
    req.body.contents : 
    // иначе создаем сами
    [
      {
        type: "markdown",
        value: "У данной статьи **нет** содержимого!"
      }
    ]; 

  var tags = req.body.tags ? 
    // если теги указаны в теле - используем их
    req.body.tags : 
    // иначе создаем сами
    ["others"];

  var currentDate = new Date();

  const new_article = new Article({
    header: req.body.name, 
    author_id: req.body.author, 
    contents: contents, 
    tags: tags,
    create_time: currentDate, 
    last_update_time: currentDate
  });

  new_article.save()
    .then((doc) => {
      console.log('Создана новая статья: ' + doc.header);
      res.status(200).json({"msg": "Статья добавлена!"});
    })
    .catch((err) => {
      console.log('Ошибка при создании статьи: ' + err);
      res.status(500).json({"msg": err});
    })

  
});

module.exports = router;
