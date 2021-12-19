const { Router } = require('express');
const router = Router();
const UploadController = require('./controller');
const AuthedRoute = require('../../middlewares/AuthedRoute');
const DBRoute = require('../../middlewares/DBRoute');
const BodyValidator = require('../../middlewares/BodyValidator');
const { body } = require('express-validator');
const defineUserAbility = require('../../middlewares/DefineAbility');
const uploadAbilities = require('./abilities');

router.use(DBRoute, AuthedRoute, defineUserAbility(uploadAbilities));

router.put('/add', UploadController.add);

router.post(
  '/delete',
  body('uploadId').isMongoId().withMessage('Необходимо ввести ID публикации!'),
  BodyValidator,
  UploadController.delete
);

router.get('/my', UploadController.userUploads);

module.exports = router;
