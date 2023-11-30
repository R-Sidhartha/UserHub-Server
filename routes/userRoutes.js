const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

// CRUD routes
router.get('/', UserController.getAllUsers);
router.get('/user/:id', UserController.getUserById);
router.post('/creatuser', UserController.createUser);
router.put('/updateuser/:id', UserController.updateUser);
router.delete('/deleteuser/:id', UserController.deleteUser);

module.exports = router;
