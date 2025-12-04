const express = require("express");
const auth = require("../middleware/auth");
const ctrl = require("../controllers/scheduleController");

const router = express.Router();
router.get("/", auth, ctrl.getMonthly);
router.patch("/:orderItemId", auth, ctrl.updateItem);
module.exports = router;
