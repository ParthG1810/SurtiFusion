const express   = require('express');
const router    = express.Router();
const auth      = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const ctrl      = require('../controllers/orderController');

// all order routes require login
router.use(auth);

router.post('/',   authorize(['admin','user']), ctrl.place);
router.get('/history',   authorize(['admin','user']), ctrl.history);
router.get('/daily-count',authorize(['admin','user']), ctrl.dailyCount);

module.exports = router;