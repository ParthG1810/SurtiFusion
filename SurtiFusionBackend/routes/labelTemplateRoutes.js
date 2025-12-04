const express = require("express");
const router = express.Router();
const authorize = require("../middleware/authorize");
const ctrl = require("../controllers/labelTemplateController");

router.get("/", authorize(["admin", "user"]), ctrl.getTemplate);
router.post("/", authorize(["admin", "user"]), ctrl.saveTemplate);

module.exports = router;
