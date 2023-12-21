const express = require('express');
const router = express.Router();
const { Storage } = require('@google-cloud/storage');
const db = require('../db');
const storage = new Storage();

const bucketName = 'bucket_upcycle'; // Ganti dengan nama bucket Cloud Storage Anda

router.post('/recycle', async (req, res) => {
  const { recycledProduct } = req.body;
  const wasteImage = req.file; // req.file akan berisi informasi tentang file gambar yang diunggah

  try {
    // Upload gambar ke Cloud Storage
    const imageBlob = storage.bucket(bucketName).file(wasteImage.originalname);
    const blobStream = imageBlob.createWriteStream();

    blobStream.on('error', (err) => {
      console.error('Error uploading to Cloud Storage:', err);
      res.status(500).json({ success: false, error: 'Failed to upload image to Cloud Storage' });
    });

    blobStream.on('finish', async () => {
      // Gambar berhasil diunggah, dapatkan URL gambar dari Cloud Storage
      const imageUrl = `https://storage.googleapis.com/${bucketName}/${imageBlob.name}`;

      // Gunakan parameterized query untuk mencegah SQL injection
      const [result] = await db.query('INSERT INTO RecyclingHistories (wasteImage, recycledProduct) VALUES (?, ?)', [imageUrl, recycledProduct]);

      const newHistoryId = result.insertId;

      res.json({
        success: true,
        message: 'Recycling history added successfully',
        historyEntry: { id: newHistoryId, wasteImage: imageUrl, recycledProduct },
      });
    });

    blobStream.end(req.file.buffer);
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
