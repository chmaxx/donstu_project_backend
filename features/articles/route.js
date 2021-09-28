const {Router}  = require('express');
const router    = Router();
const ArticleController = require('./controller');
const AuthedRoute = require('../../middlewares/AuthedRoute');

router.get('/', ArticleController.get);
router.post('/add', AuthedRoute, ArticleController.add);
router.post('/archive', AuthedRoute, ArticleController.archive)
router.post('/unarchive', AuthedRoute, ArticleController.unarchive)

module.exports = router;
