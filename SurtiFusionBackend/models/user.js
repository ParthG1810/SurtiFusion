const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class User extends Model {}
User.init({
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'userpassword'
  },
  role: {
    type: DataTypes.ENUM('admin', 'user'),
    allowNull: false,
    defaultValue: 'user'
  }
}, {
  sequelize,
  modelName: 'user',
  timestamps: true
});

module.exports = User;