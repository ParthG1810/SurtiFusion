const { Op }      = require('sequelize');
const { Order, OrderItem, MealPlan, Customer } = require('../models');

exports.place = async (req, res) => {
  try {
    const { customerId, startDate, endDate, items } = req.body;
    if (!customerId) return res.status(400).json({ message:'customerId required' });

    const order = await Order.create({ customerId, startDate, endDate });
    await Promise.all(
      items.map(i => OrderItem.create({
        orderId:     order.id,
        mealPlanId:  i.mealPlanId,
        quantity:    i.quantity,
        selectedDays:i.selectedDays
      }))
    );
    res.status(201).json(order);
  } catch (err) {
    console.error('order.place error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.history = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: Customer, attributes:['id','name'] },
        { model: OrderItem, include: [MealPlan] }
      ]
    });
    res.json(orders);
  } catch (err) {
    console.error('order.history error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.dailyCount = async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0,10);
    const items = await OrderItem.findAll({
      include: [
        {
          model: Order,
          where: { startDate: { [Op.lte]: today }, endDate: { [Op.gte]: today } },
          include: [{ model: Customer, attributes:['id','name','address'] }]
        },
        { model: MealPlan }
      ]
    });
    res.json(items);
  } catch (err) {
    console.error('order.dailyCount error:', err);
    res.status(500).json({ message: err.message });
  }
};