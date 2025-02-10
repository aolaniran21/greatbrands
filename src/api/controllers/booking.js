const { Event, Booking, WaitingList } = require("../../models");
const redisLock = require("../../middlewares/redisLock");
const responseHandler = require("../../utils/responseHandler");

exports.bookTicket = async (req, res) => {
  const { eventId, userId } = req.body;

  if (!eventId || !userId) {
    return responseHandler.error(res, "Invalid booking request", 400);
  }

  const lockKey = `event_lock_${eventId}`;
  const lock = await redisLock.acquireLock(lockKey, 5000);

  if (!lock) return responseHandler.error(res, "System busy, try again", 429);

  try {
    const event = await Event.findByPk(eventId);

    if (!event) {
      await redisLock.releaseLock(lockKey);
      return responseHandler.error(res, "Event not found", 404);
    }

    if (event.availableTickets > 0) {
      await Booking.create({ eventId, userId });
      event.availableTickets -= 1;
      await event.save();
      await redisLock.releaseLock(lockKey);
      return responseHandler.success(res, "Ticket booked successfully");
    } else {
      await WaitingList.create({ eventId, userId });
      await redisLock.releaseLock(lockKey);
      return responseHandler.success(
        res,
        "Event sold out, added to waiting list"
      );
    }
  } catch (error) {
    await redisLock.releaseLock(lockKey);
    return responseHandler.error(res, "Booking failed", 500);
  }
};

exports.cancelBooking = async (req, res) => {
  const { eventId, userId } = req.body;

  if (!eventId || !userId) {
    return responseHandler.error(res, "Invalid cancellation request", 400);
  }

  const lockKey = `event_lock_${eventId}`;
  const lock = await redisLock.acquireLock(lockKey, 5000);

  if (!lock) return responseHandler.error(res, "System busy, try again", 429);

  try {
    const booking = await Booking.findOne({ where: { eventId, userId } });

    if (!booking) {
      await redisLock.releaseLock(lockKey);
      return responseHandler.error(res, "No active booking found", 404);
    }

    await booking.destroy();

    const nextInLine = await WaitingList.findOne({
      where: { eventId },
      order: [["createdAt", "ASC"]],
    });

    if (nextInLine) {
      await Booking.create({ eventId, userId: nextInLine.userId });
      await nextInLine.destroy();
    } else {
      const event = await Event.findByPk(eventId);
      event.availableTickets += 1;
      await event.save();
    }

    await redisLock.releaseLock(lockKey);
    return responseHandler.success(res, "Booking canceled successfully");
  } catch (error) {
    await redisLock.releaseLock(lockKey);
    return responseHandler.error(res, "Cancellation failed", 500);
  }
};
