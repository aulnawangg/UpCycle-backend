const express = require('express');
const router = express.Router();
const { registerUser, loginUser, changePassword } = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.patch('/change-password', changePassword); 

module.exports = router;
