const { MealPlan } = require('../models');

exports.list = async (req, res) => {
  try {
    res.json(await MealPlan.findAll());
  } catch (err) {
    console.error('mealPlan.list error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const m = await MealPlan.create(req.body);
    res.status(201).json(m);
  } catch (err) {
    console.error('mealPlan.create error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    await MealPlan.update(req.body, { where: { id: req.params.id } });
    res.sendStatus(204);
  } catch (err) {
    console.error('mealPlan.update error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await MealPlan.destroy({ where: { id: req.params.id } });
    res.sendStatus(204);
  } catch (err) {
    console.error('mealPlan.remove error:', err);
    res.status(500).json({ message: err.message });
  }
};