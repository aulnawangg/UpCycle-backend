const express = require('express');
const router = express.Router();
const {
  addRecyclingHistory,
  deleteRecyclingHistory,
  getRecyclingHistoryById,
  getAllRecyclingHistories,
} = require('../controllers/recyclingHistoryController');

router.post('/recycle', addRecyclingHistory);
router.delete('/recycle/:historyId', deleteRecyclingHistory);
router.get('/recycle/list/:historyId', getRecyclingHistoryById);
router.get('/recycle', getAllRecyclingHistories);

module.exports = router;