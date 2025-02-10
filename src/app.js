const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const routes = require("./api/routes");
const { sequelize } = require("./models");
const errorMiddleware = require("./middlewares/error");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Security middleware
app.use(cors());
app.use(helmet());

// Logging middleware (use `dev` format in development)
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Body parsing middleware
app.use(bodyParser.json());
app.use(errorMiddleware);

// API Routes
app.use("/api", routes);

// Health Check Route
app.get("/", (req, res) => {
  res.json({ message: "Event Ticket Booking API is running!" });
});

// Database Connection Test
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connected");
    return sequelize.sync();
  })
  .then(() => console.log("🔄 Database synchronized"))
  .catch((err) => console.error("❌ Database connection failed:", err));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

module.exports = app;
