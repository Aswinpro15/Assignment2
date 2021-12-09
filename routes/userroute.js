const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/usermodel');
const checkAuth = require('../middleware/userauth');
const userController = require('../controllers/usercontroller');

router.post('/register', usercontroller.registerUser);
router.post('/login', usercontroller.loginUser);
router.get('/getall', checkAuth.verifyToken, usercontroller.getAllUsers);
router.update('/update', checkAuth.verifyToken, usercontroller.updateUser);
router.delete('/remove', checkAuth.verifyToken, usercontroller.removeUser);
router.post('/logout', checkAuth.verifyToken, usercontroller.logoutUser);

module.exports = router;