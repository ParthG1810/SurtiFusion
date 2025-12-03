const { Customer } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.register = async (req, res) => {
  const { name, phone, address } = req.body;
  try {
    const existing = await Customer.findOne({ where: { phone } });
    if (existing) return res.status(400).json({ message: 'Phone in use' });
    const customer = await Customer.create({ name, phone, address });
    const token = jwt.sign({ id: customer.id }, process.env.JWT_SECRET);
    res.json({ token, customer });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.login = async (req, res) => {
  const { phone } = req.body;
  try {
    const customer = await Customer.findOne({ where: { phone } });
    if (!customer) return res.status(400).json({ message: 'Not found' });
    const token = jwt.sign({ id: customer.id }, process.env.JWT_SECRET);
    res.json({ token, customer });
  } catch (err) { res.status(500).json({ message: err.message }); }
};