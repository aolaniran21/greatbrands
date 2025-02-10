const express = require("express");
const { body } = require("express-validator");

const authMiddleware = require("../../middlewares/auth");

const eventController = require("../controllers/event");

const router = express.Router();

router.post("/events", authMiddleware, eventController.createEvent);
router.get("/events/:eventId", authMiddleware, eventController.getEventStatus);

module.exports = router;
