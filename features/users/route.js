const { Router } = require('express');
const router = Router();

const UserController = require('./controller');
const AuthedRoute = require('../../middlewares/AuthedRoute');
const DBRoute = require('../../middlewares/DBRoute');
const BodyValidator = require('../../middlewares/BodyValidator');
const { body } = require('express-validator');
const defineUserAbility = require('../../middlewares/DefineAbility');
const userAbilities = require('./abilities');

const {
  loginValidator,
  passwordValidator,
  nameFieldValidator,
  nameFieldSanitizer,
} = require('./validators');

router.use(DBRoute);

router.post(
  '/register',
  body('login').custom(loginValidator),
  body('firstName').custom(nameFieldValidator('Имя')).customSanitizer(nameFieldSanitizer),
  body('lastName').custom(nameFieldValidator('Фамилия')).customSanitizer(nameFieldSanitizer),
  body('email').isEmail().withMessage('Неверный E-Mail!'),
  body('password').custom(passwordValidator),
  BodyValidator,
  UserController.register
);

router.post(
  '/login',
  body('email').isEmail().withMessage('Неверный E-Mail!'),
  body('password').isString().withMessage('Необходимо ввести пароль!'),
  BodyValidator,
  UserController.login
);

router.post('/logout', UserController.logout);

router.get('/activate/:link', UserController.activate);
router.get('/refreshToken', UserController.refreshToken);

router.use(AuthedRoute, defineUserAbility(userAbilities));

router.post(
  '/changePassword',
  // Не будем заморачиваться с дотошной проверкой
  // старого пароля (passwordValidator), она тут ни к чему
  body('oldPassword').isString().withMessage('Необходимо ввести старый пароль!'),
  body('newPassword').custom(passwordValidator),
  BodyValidator,
  UserController.changePassword
);

router.post(
  '/changeAvatar',
  body('upload_id').isMongoId().withMessage('Необходимо ввести Id файла!'),
  BodyValidator,
  UserController.changeAvatar
);

router.post(
  '/changeUserInfo',
  body('userId').isMongoId().withMessage('Необходимо ввести ID пользователя!'),
  body('updateData').isJSON().withMessage('Необходимо ввести поля для обновления!'),
  BodyValidator,
  UserController.changeUserInfo
);

router.get('/getInfo', UserController.getInfo);

module.exports = router;
