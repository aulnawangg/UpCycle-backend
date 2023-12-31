const { Storage } = require('@google-cloud/storage');
const db = require('../db');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const authenticateToken = require('../middleware/authMiddleware');

// Inisialisasi klien Cloud Storage
const storage = new Storage();

const bucketName = 'bucket_upcycle'; // Ganti dengan nama bucket Cloud Storage Anda

const addRecyclingHistory = async (req, res) => {
  try {
    const { recycledProduct } = req.body;
    const wasteImage = req.file; // req.file akan berisi informasi tentang file gambar yang diunggah

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
      const [result] = await db.query('INSERT INTO recyclinghistories (wasteImage, recycledProduct) VALUES (?, ?)', [imageUrl, recycledProduct]);

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
};


const deleteRecyclingHistory = async (req, res) => {
  try {
    const historyId = req.params.historyId;
    
    // Gunakan parameterized query untuk mencegah SQL injection
    const [result] = await db.query('DELETE FROM recyclinghistories WHERE id = ?', [historyId]);

    if (result.affectedRows > 0) {
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
}

const getRecyclingHistoryById = async (req, res) => {
  try {
    const historyId = req.params.historyId;
    
    // Gunakan parameterized query untuk mencegah SQL injection
    const [result] = await db.query('SELECT * FROM recyclinghistories WHERE id = ?', [historyId]);

    if (result.length > 0) {
      const recyclingHistory = result[0];
      res.json({
        success: true,
        message: `Recycling history with ID ${historyId} retrieved successfully`,
        recyclingHistory,
      });
    } else {
      res.status(404).json({ success: false, error: 'Recycling history not found' });
    }
  } catch (error) {
    console.error('Failed to retrieve recycling history by ID:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve recycling history by ID' });
  }
};

const getAllRecyclingHistories = async (req, res) => {
  try {
    // Gunakan parameterized query untuk mencegah SQL injection
    const [result] = await db.query('SELECT * FROM recyclinghistories');

    res.json({
      success: true,
      message: 'All recycling histories retrieved successfully',
      recyclinghistories: result,
    });
  } catch (error) {
    console.error('Failed to retrieve all recycling histories:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve all recycling histories' });
  }
};

// Export fungsi-fungsi yang telah diubah
module.exports = { addRecyclingHistory, deleteRecyclingHistory, getRecyclingHistoryById, getAllRecyclingHistories};