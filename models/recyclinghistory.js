'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RecyclingHistory extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }

  RecyclingHistory.init(
    {
      wasteImage: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      recycledProduct: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'RecyclingHistory',
    }
  );

  return RecyclingHistory;
};