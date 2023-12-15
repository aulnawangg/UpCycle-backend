const express = require('express');
const router = express.Router();
const { registerUser, loginUser, changePassword, getUserList, getAllUsers, updateUser, updateUserImage } = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/user/list/:userId', getUserList);
router.get('/user', getAllUsers);
router.put('/user/update', updateUser);
router.put('/user/image', updateUserImage);
router.patch('/change-password', changePassword);

module.exports = router;
