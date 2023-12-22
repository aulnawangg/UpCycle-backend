const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const recyclingHistoryController = require('../controllers/recyclingHistoryController');
const authenticateToken = require('../middleware/authMiddleware');
const db = require('../db');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/user/list/:userId', userController.getUserList);
router.get('/user', userController.getAllUsers);
router.put('/user/update', userController.updateUser);
router.put('/user/image', userController.updateUserImage);
router.patch('/change-password', userController.changePassword);

router.post('/recycle', recyclingHistoryController.addRecyclingHistory);
router.delete('/recycle/:historyId', recyclingHistoryController.deleteRecyclingHistory);
router.get('/recycle/list/:historyId', recyclingHistoryController.getRecyclingHistoryById);
router.get('/recycle', recyclingHistoryController.getAllRecyclingHistories);

module.exports = router;
