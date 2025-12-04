const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

exports.registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (await User.findOne({ where: { username } }))
      return res.status(400).json({ message: 'Username taken' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hash });
    res.status(201).json({ id: user.id, username: user.username });
  } catch (err) {
    console.error('registerUser error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    /*const ok = await bcrypt.compare(password, user.password);
    if (!ok)*/
    if(password != user.password) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET
    );
    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (err) {
    console.error('loginUser error:', err);
    res.status(500).json({ message: err.message });
  }
};