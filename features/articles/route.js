const {Router}  = require('express');
const router    = Router();
const ArticleController = require('./controller');
const AuthedRoute = require('../../middlewares/AuthedRoute');
const DBRoute = require('../../middlewares/DBRoute');

router.get('/', DBRoute, ArticleController.get);
router.post('/add', DBRoute, AuthedRoute, ArticleController.add);
router.post('/archive', DBRoute, AuthedRoute, ArticleController.archive)
router.post('/unarchive', DBRoute, AuthedRoute, ArticleController.unarchive)

module.exports = router;
