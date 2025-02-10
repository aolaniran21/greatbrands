const express = require("express");
const authRoutes = require("./auth");
const eventRoutes = require("./event"); // Existing
const bookingRoutes = require("./booking"); // Existing

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/events", eventRoutes);
router.use("/bookings", bookingRoutes);

module.exports = router;
