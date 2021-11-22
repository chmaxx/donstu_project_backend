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
  body('name').isString().withMessage('Необходимо ввести название статьи!'),
  body('contents').isString().withMessage('У статьи нет содержимого!'),
  body('description').isString().withMessage('У статьи нет описания!'),
  body('tags').isString().withMessage('У статьи нет тегов!'),
  BodyValidator,
  ArticleController.add
);

module.exports = router;
