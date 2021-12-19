const { Router } = require('express');
const router = Router();
const ArticleController = require('./controller');
const AuthedRoute = require('../../middlewares/AuthedRoute');
const DBRoute = require('../../middlewares/DBRoute');
const BodyValidator = require('../../middlewares/BodyValidator');
const { body } = require('express-validator');
const defineUserAbility = require('../../middlewares/DefineAbility');
const articleAbilities = require('./abilities');

router.use(DBRoute);

router.get('/', ArticleController.get);
router.get('/:id', ArticleController.getById);

router.use(AuthedRoute, defineUserAbility(articleAbilities));

router.post(
  '/add',
  body('header').isString().withMessage('Необходимо ввести название статьи!'),
  body('contents').isString().withMessage('У статьи нет содержимого!'),
  body('description').isString().withMessage('Необходимо ввести описание!'),
  body('thumbnailURL').isURL().withMessage('Необходимо ввести ссылку на превью!'),
  body('tags').isJSON().withMessage('Необходимо ввести теги!'),
  BodyValidator,
  ArticleController.add
);

router.post(
  '/update',
  body('articleId').isMongoId().withMessage('Необходимо ввести ID статьи!'),
  body('updateData').isJSON().withMessage('Необходимо ввести поля для обновления!'),
  BodyValidator,
  ArticleController.update
);

router.post(
  '/delete',
  body('articleId').isMongoId().withMessage('Необходимо ввести ID статьи!'),
  BodyValidator,
  ArticleController.delete
);

module.exports = router;
