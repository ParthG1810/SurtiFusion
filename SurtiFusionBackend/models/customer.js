const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class Customer extends Model {}
Customer.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "customername",
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "customer",
    timestamps: true,
  }
);

module.exports = Customer;
