const express   = require('express');
const router    = express.Router();
const authorize = require('../middleware/authorize');
const ctrl      = require('../controllers/mealPlanController');

router.get('/',    authorize(['admin','user']), ctrl.list);
router.post('/',   authorize(['admin']),        ctrl.create);
router.put('/:id', authorize(['admin']),        ctrl.update);
router.delete('/:id', authorize(['admin']),     ctrl.remove);

module.exports = router;