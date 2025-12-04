const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class LabelTemplate extends Model {}
LabelTemplate.init(
  {
    content: { type: DataTypes.TEXT, allowNull: false },
  },
  {
    sequelize,
    modelName: "label_template",
    timestamps: true,
  }
);

module.exports = LabelTemplate;
