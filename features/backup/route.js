const { Router } = require('express');
const router = Router();
const BackupController = require('./controller');

router.get('/list', BackupController.getlist);
router.get('/getbackup/:id?', BackupController.getbackup);

module.exports = router;
