const express = require('express');
const router  = express.Router();

router.use('/users',      require('./userRoutes'));
router.use('/customers',  require('./customerRoutes'));
router.use('/meal-plans', require('./mealPlanRoutes'));
router.use('/orders',     require('./orderRoutes'));
router.use('/print', require('./printRoutes'));

module.exports = router;