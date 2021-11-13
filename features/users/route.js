const { Router } = require('express');
const router = Router();

const UserController = require('./controller');
const AuthedRoute = require('../../middlewares/AuthedRoute');
const DBRoute = require('../../middlewares/DBRoute');
const BodyValidator = require('../../middlewares/BodyValidator');
const { body } = require('express-validator');

const {
  loginValidator,
  passwordValidator,
  nameFieldValidator,
  nameFieldSanitizer,
} = require('./validators');

router.post(
  '/register',
  DBRoute,
  body('login').custom(loginValidator),
  body('firstName')
    .custom(nameFieldValidator('Имя'))
    .customSanitizer(nameFieldSanitizer),
  body('lastName')
    .custom(nameFieldValidator('Фамилия'))
    .customSanitizer(nameFieldSanitizer),
  body('email').isEmail().withMessage('Неверный E-Mail!'),
  body('password').custom(passwordValidator),
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

router.post(
  '/changePassword',
  DBRoute,
  AuthedRoute,
  // Не будем заморачиваться с дотошной проверкой
  // старого пароля (passwordValidator), она тут ни к чему
  body('oldPassword')
    .isString()
    .withMessage('Необходимо ввести старый пароль!'),
  body('newPassword').custom(passwordValidator),
  BodyValidator,
  UserController.changePassword
);

router.post(
  '/changeAvatar',
  DBRoute,
  AuthedRoute,
  body('upload_id').isMongoId().withMessage('Необходимо ввести ID файла!'),
  BodyValidator,
  UserController.changeAvatar
);

router.get('/getInfo', DBRoute, AuthedRoute, UserController.getInfo);

router.get('/activate/:link', DBRoute, UserController.activate);
router.get('/refreshToken', DBRoute, UserController.refreshToken);

module.exports = router;
