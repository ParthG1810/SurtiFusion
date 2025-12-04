const { Op } = require("sequelize");
const dayjs = require("dayjs");
const { Customer, MealPlan, Order, OrderItem } = require("../models");

// GET /api/schedule?month=YYYY-MM
exports.getMonthly = async (req, res, next) => {
  try {
    const { month } = req.query; // e.g. "2025-06"
    const start = dayjs(`${month}-01`).startOf("month").toDate();
    const end = dayjs(`${month}-01`).endOf("month").toDate();

    const orders = await Order.findAll({
      where: { date: { [Op.between]: [start, end] } },
      include: [
        { model: Customer },
        {
          model: OrderItem,
          include: [{ model: MealPlan }],
        },
      ],
    });

    /**
     * Transform →   {
     *    [customerId]: {
     *      customer,            // full model
     *      days: {
     *        1: { id, mealPlan, isAbsent },
     *        2: { … },
     *        …
     *      }
     *    }
     * }
     */
    const matrix = {};
    orders.forEach((order) => {
      const day = dayjs(order.date).date();
      const cId = order.Customer.id;
      if (!matrix[cId]) {
        matrix[cId] = { customer: order.Customer, days: {} };
      }
      order.OrderItems.forEach((itm) => {
        matrix[cId].days[day] = {
          id: itm.id,
          mealPlan: itm.MealPlan, // full plan (contains .code + pricePerDay)
          isAbsent: itm.isAbsent,
        };
      });
    });

    res.json(matrix);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/schedule/:orderItemId  { isAbsent: true/false }
exports.updateItem = async (req, res, next) => {
  try {
    const { orderItemId } = req.params;
    const { isAbsent } = req.body;

    const item = await OrderItem.findByPk(orderItemId);
    if (!item) return res.status(404).json({ message: "Order item not found" });

    item.isAbsent = Boolean(isAbsent);
    await item.save();

    res.json(item);
  } catch (err) {
    next(err);
  }
};
