const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { sequelize } = require("./models");
const app = express();
const port = process.env.PORT || 5000;

// Global logging & parsing
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// Mount API routes
app.use("/api", require("./routes"));

// Error handler
app.use((err, req, res, next) => {
  console.error("ERROR:", err.stack || err);
  res.status(500).json({ message: err.message || "Server error" });
});

// Start
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("✅ Database synced (tables created/updated).");
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => {
    console.error("❌ Unable to sync database:", err);
  });
