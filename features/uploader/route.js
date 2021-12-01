const { Router } = require('express');
const router = Router();
const UploadController = require('./controller');
const AuthedRoute = require('../../middlewares/AuthedRoute');
const DBRoute = require('../../middlewares/DBRoute');
const BodyValidator = require('../../middlewares/BodyValidator');
const { body } = require('express-validator');

router.put('/add', DBRoute, AuthedRoute, UploadController.add);

router.post(
  '/delete',
  DBRoute,
  AuthedRoute,
  body('uploadId').isMongoId().withMessage('Необходимо ввести ID публикации!'),
  BodyValidator,
  UploadController.delete
);

module.exports = router;
