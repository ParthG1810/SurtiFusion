const authorize = require('../middleware/authorize');

// only admins can manage customers
router.use('/customers',
  authorize(['admin']),
  require('./customerRoutes')
);

// for meal plans, maybe both admin & regular can list, but only admin can create/update/delete
router.route('/meal-plans')
  .get(authorize(['admin','user']), list)
  .post(authorize(['admin']), create);
router.route('/meal-plans/:id')
  .put(authorize(['admin']), update)
  .delete(authorize(['admin']), remove);
