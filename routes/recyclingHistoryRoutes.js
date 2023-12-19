const express = require('express');
const router = express.Router();
const recyclingHistoryController = require('../controllers/recyclingHistoryController');
const db = require('../db');

router.post('/recycle', async (req, res) => {
  const { wasteImage, recycledProduct } = req.body;
  try {
    const newHistory = await db.execute(
      'INSERT INTO RecyclingHistories (wasteImage, recycledProduct) VALUES (?, ?)',
      [wasteImage, recycledProduct]
    );

    res.json({
      success: true,
      message: 'Recycling history added successfully',
      historyEntry: newHistory[0],
    });
  } catch (error) {
    console.error('Failed to add recycling history:', error);
    res.status(500).json({ success: false, error: 'Failed to add recycling history' });
  }
});

router.delete('/recycle/:historyId', async (req, res) => {
  const historyId = req.params.historyId;
  try {
    const deletedHistory = await db.execute('DELETE FROM RecyclingHistories WHERE id = ?', [historyId]);

    if (deletedHistory[0].affectedRows > 0) {
      res.json({
        success: true,
        message: `Recycling history with ID ${historyId} deleted`,
      });
    } else {
      res.status(404).json({ success: false, error: 'Recycling history not found' });
    }
  } catch (error) {
    console.error('Failed to delete recycling history:', error);
    res.status(500).json({ success: false, error: 'Failed to delete recycling history' });
  }
});

router.get('/recycle/list/:historyId', async (req, res) => {
  const historyId = req.params.historyId;
  try {
    const [recyclingHistory] = await db.execute('SELECT * FROM RecyclingHistories WHERE id = ?', [historyId]);

    if (recyclingHistory.length > 0) {
      res.json({
        success: true,
        message: `Recycling history with ID ${historyId} retrieved successfully`,
        recyclingHistory: recyclingHistory[0],
      });
    } else {
      res.status(404).json({ success: false, error: 'Recycling history not found' });
    }
  } catch (error) {
    console.error('Failed to retrieve recycling history by ID:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve recycling history by ID' });
  }
});

router.get('/recycle', async (req, res) => {
  try {
    const [recyclingHistories] = await db.execute('SELECT * FROM RecyclingHistories');

    res.json({
      success: true,
      message: 'All recycling histories retrieved successfully',
      recyclingHistories,
    });
  } catch (error) {
    console.error('Failed to retrieve all recycling histories:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve all recycling histories' });
  }
});

module.exports = router;
