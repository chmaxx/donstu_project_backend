const {Router} = require('express');
const router = Router();

const UserController = require('./controller');

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.get('/activate/:link', UserController.activate);
router.get('/refreshToken', UserController.refreshToken);

module.exports = router; 
