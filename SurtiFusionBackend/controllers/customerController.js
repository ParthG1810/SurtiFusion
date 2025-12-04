const { Customer } = require('../models');

exports.list = async (req, res) => {
  try {
    res.json(await Customer.findAll());
  } catch (err) {
    console.error('customer.list error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const c = await Customer.create(req.body);
    res.status(201).json(c);
  } catch (err) {
    console.error('customer.create error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    await Customer.update(req.body, { where: { id: req.params.id } });
    res.sendStatus(204);
  } catch (err) {
    console.error('customer.update error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Customer.destroy({ where: { id: req.params.id } });
    res.sendStatus(204);
  } catch (err) {
    console.error('customer.remove error:', err);
    res.status(500).json({ message: err.message });
  }
};