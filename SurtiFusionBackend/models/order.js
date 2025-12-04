const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Order extends Model {}
Order.init({
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'order',
  timestamps: true
});

module.exports = Order;