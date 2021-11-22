const { Router } = require('express');
const router = Router();
const UploadController = require('./controller');
const AuthedRoute = require('../../middlewares/AuthedRoute');
const DBRoute = require('../../middlewares/DBRoute');

router.put('/add', DBRoute, AuthedRoute, UploadController.add);

module.exports = router;
