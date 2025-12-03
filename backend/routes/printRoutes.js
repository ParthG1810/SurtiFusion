// backend/routes/printRoutes.js
const express = require('express');
const router  = express.Router();
const authorize = require('../middleware/authorize');
const { printLabels } = require('../controllers/printController');

router.post('/print-labels', authorize(['admin','user']), printLabels);

module.exports = router;
