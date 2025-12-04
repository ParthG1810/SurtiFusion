const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class OrderItem extends Model {}
OrderItem.init(
  {
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    isAbsent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    selectedDays: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const raw = this.getDataValue("selectedDays");
        return raw ? raw.split(",") : [];
      },
      set(val) {
        this.setDataValue(
          "selectedDays",
          Array.isArray(val) ? val.join(",") : val
        );
      },
    },
  },
  {
    sequelize,
    modelName: "order_item",
    timestamps: false,
  }
);

module.exports = OrderItem;
