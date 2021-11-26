const { Router } = require('express');
const router = Router();
const ArticleController = require('./controller');
const AuthedRoute = require('../../middlewares/AuthedRoute');
const DBRoute = require('../../middlewares/DBRoute');
const BodyValidator = require('../../middlewares/BodyValidator');
const { body } = require('express-validator');

router.get('/', DBRoute, ArticleController.get);

router.post(
  '/add',
  DBRoute,
  AuthedRoute,
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
  DBRoute,
  AuthedRoute,
  body('articleID').isMongoId().withMessage('Необходимо ввести ID статьи!'),
  body('updateData').isJSON().withMessage('Необходимо ввести поля для обновления!'),
  BodyValidator,
  ArticleController.update
);

router.post(
  '/delete',
  DBRoute,
  AuthedRoute,
  body('articleID').isMongoId().withMessage('Необходимо ввести ID статьи!'),
  BodyValidator,
  ArticleController.delete
);

module.exports = router;
