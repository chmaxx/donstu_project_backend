const {Router} = require('express');
const router = Router();

const UserController = require('./controller');
const AuthedRoute = require('../../middlewares/AuthedRoute');
const DBRoute = require('../../middlewares/DBRoute');

router.post('/register', DBRoute, UserController.register);
router.post('/login', DBRoute, UserController.login);
router.post('/logout', DBRoute, UserController.logout);
router.get('/activate/:link', DBRoute, UserController.activate);
router.get('/refreshToken', DBRoute, UserController.refreshToken);
router.get('/getAll', DBRoute, AuthedRoute, UserController.getUsers);

module.exports = router; 
