const {Router}  = require('express');
const router    = Router();
const ArticleController = require('./controller'); 

router.get('/', ArticleController.get);
router.post('/add', ArticleController.add);
router.post('/archive', ArticleController.archive)
router.post('/unarchive', ArticleController.unarchive)

module.exports = router;
