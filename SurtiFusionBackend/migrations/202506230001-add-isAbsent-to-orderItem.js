"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("orderItems", "isAbsent", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn("orderItems", "isAbsent");
  },
};
