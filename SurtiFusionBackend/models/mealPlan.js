const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class MealPlan extends Model {}
MealPlan.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "planname",
    },
    frequency: {
      type: DataTypes.ENUM("Weekly", "Monthly", "Single"),
      allowNull: false,
    },
    days: {
      type: DataTypes.ENUM("Mon-Fri", "Mon-Sat"),
      allowNull: true,
    },
    items: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "meal_plan",
    timestamps: true,
  }
);

module.exports = MealPlan;
