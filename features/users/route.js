const { Router } = require('express');
const router = Router();

const UserController = require('./controller');
const AuthedRoute = require('../../middlewares/AuthedRoute');
const DBRoute = require('../../middlewares/DBRoute');
const BodyValidator = require('../../middlewares/BodyValidator');
const { body } = require('express-validator');

router.post(
  '/register',
  DBRoute,
  body('login').isString().withMessage('Необходимо ввести логин!'),
  body('firstName').isString().withMessage('Необходимо ввести имя!'),
  body('lastName').isString().withMessage('Необходимо ввести фамилию!'),
  body('email').isEmail().withMessage('Неверный E-Mail!'),
  body('password').isString().withMessage('Необходимо ввести пароль!'),
  BodyValidator,
  UserController.register
);

router.post(
  '/login',
  DBRoute,
  body('email').isEmail().withMessage('Неверный E-Mail!'),
  body('password').isString().withMessage('Необходимо ввести пароль!'),
  BodyValidator,
  UserController.login
);

router.post('/logout', DBRoute, UserController.logout);
router.get('/activate/:link', DBRoute, UserController.activate);
router.get('/refreshToken', DBRoute, UserController.refreshToken);
router.get('/getAll', DBRoute, AuthedRoute, UserController.getUsers);

module.exports = router;
