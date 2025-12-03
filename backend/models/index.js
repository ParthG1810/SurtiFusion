const sequelize  = require('../config/db');
const User       = require('./user');
const Customer   = require('./customer');
const MealPlan   = require('./mealPlan');
const Order      = require('./order');
const OrderItem  = require('./orderItem');

// Associations
Customer.hasMany(Order, { foreignKey: 'customerId', onDelete: 'CASCADE' });
Order.belongsTo(Customer, { foreignKey: 'customerId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order,   { foreignKey: 'orderId' });

MealPlan.hasMany(OrderItem, { foreignKey: 'mealPlanId', onDelete: 'RESTRICT' });
OrderItem.belongsTo(MealPlan, { foreignKey: 'mealPlanId' });

module.exports = {
  sequelize,
  User,
  Customer,
  MealPlan,
  Order,
  OrderItem
};