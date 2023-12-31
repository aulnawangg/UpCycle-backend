// ... definisi model lainnya

const RecyclingHistory = require('./recyclinghistory');
const authenticateToken = require('../middleware/authMiddleware');
const User = require('./user');

RecyclingHistory.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(RecyclingHistory, { foreignKey: 'userId' });

module.exports = {RecyclingHistory, User};
