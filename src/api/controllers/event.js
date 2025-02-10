const { Event } = require("../../models");
const logger = require("../../utils/logger");
const responseHandler = require("../../utils/responseHandler");

exports.createEvent = async (req, res) => {
  try {
    const { name, totalTickets } = req.body;

    if (!name || !totalTickets || totalTickets <= 0) {
      return responseHandler.error(res, "Invalid event details", 400);
    }

    const event = await Event.create({
      name,
      totalTickets,
      availableTickets: totalTickets,
    });

    logger.info(`Event created: ${event.id}`);
    return responseHandler.success(
      res,
      "Event initialized successfully",
      event,
      201
    );
  } catch (error) {
    logger.error("Error creating event", error);
    return responseHandler.error(res, "Internal server error", 500);
  }
};

exports.getEventStatus = async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await Event.findByPk(eventId, {
      include: [{ model: WaitingList, as: "waitingList" }],
    });

    if (!event) return responseHandler.error(res, "Event not found", 404);

    const response = {
      eventId: event.id,
      name: event.name,
      availableTickets: event.availableTickets,
      waitingListCount: event.waitingList.length,
    };

    return responseHandler.success(res, "Event status retrieved", response);
  } catch (error) {
    return responseHandler.error(res, "Failed to fetch event status", 500);
  }
};
