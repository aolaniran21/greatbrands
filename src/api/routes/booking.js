const express = require("express");
const { body } = require("express-validator");

const authMiddleware = require("../../middlewares/auth");

const bookingController = require("../controllers/booking");

const router = express.Router();

router.post("/book", authMiddleware, bookingController.bookTicket);
router.post("/cancel", authMiddleware, bookingController.cancelBooking);

module.exports = router;
