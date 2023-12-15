const { RecyclingHistory } = require('../models');

const addRecyclingHistory = async (req, res) => {
  try {
    const { wasteImage, recycledProduct } = req.body;
    const newHistory = await RecyclingHistory.create({
      wasteImage,
      recycledProduct,
    });

    res.json({
      success: true,
      message: 'Recycling history added successfully',
      historyEntry: newHistory,
    });
  } catch (error) {
    console.error('Failed to add recycling history:', error);
    res.status(500).json({ success: false, error: 'Failed to add recycling history' });
  }
};

const deleteRecyclingHistory = async (req, res) => {
  try {
    const historyId = req.params.historyId;
    const deletedHistory = await RecyclingHistory.destroy({
      where: { id: historyId },
    });

    if (deletedHistory) {
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
    const recyclingHistory = await RecyclingHistory.findByPk(historyId);

    if (recyclingHistory) {
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
      const recyclingHistories = await RecyclingHistory.findAll();
  
      res.json({
        success: true,
        message: 'All recycling histories retrieved successfully',
        recyclingHistories,
      });
    } catch (error) {
      console.error('Failed to retrieve all recycling histories:', error);
      res.status(500).json({ success: false, error: 'Failed to retrieve all recycling histories' });
    }
  };
  module.exports = { addRecyclingHistory, deleteRecyclingHistory, getRecyclingHistoryById, getAllRecyclingHistories };