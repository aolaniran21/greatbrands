const { bookTicket, cancelBooking } = require("../../api/controllers/booking");
const { Event, Booking, WaitingList } = require("../../models");
const redisLock = require("../../middlewares/redisLock");
const responseHandler = require("../../utils/responseHandler");

jest.mock("../../models", () => ({
  Event: { findByPk: jest.fn() },
  Booking: { create: jest.fn(), findOne: jest.fn(), destroy: jest.fn() },
  WaitingList: { create: jest.fn(), findOne: jest.fn(), destroy: jest.fn() },
}));

jest.mock("../../middlewares/redisLock", () => ({
  acquireLock: jest.fn(),
  releaseLock: jest.fn(),
}));

jest.mock("../../utils/responseHandler", () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

describe("Booking Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should successfully book a ticket when available", async () => {
    redisLock.acquireLock.mockResolvedValue(true);
    Event.findByPk.mockResolvedValue({ availableTickets: 2, save: jest.fn() });
    Booking.create.mockResolvedValue({});

    const req = { body: { eventId: "1", userId: "user123" } };
    const res = {};
    await bookTicket(req, res);

    expect(Booking.create).toHaveBeenCalled();
    expect(responseHandler.success).toHaveBeenCalledWith(
      res,
      "Ticket booked successfully"
    );
  });

  test("should add user to waiting list if event is sold out", async () => {
    redisLock.acquireLock.mockResolvedValue(true);
    Event.findByPk.mockResolvedValue({ availableTickets: 0, save: jest.fn() });
    WaitingList.create.mockResolvedValue({});

    const req = { body: { eventId: "1", userId: "user123" } };
    const res = {};
    await bookTicket(req, res);

    expect(WaitingList.create).toHaveBeenCalled();
    expect(responseHandler.success).toHaveBeenCalledWith(
      res,
      "Event sold out, added to waiting list"
    );
  });

  test("should cancel booking and assign ticket to next user in waiting list", async () => {
    redisLock.acquireLock.mockResolvedValue(true);
    Booking.findOne.mockResolvedValue({ destroy: jest.fn() });
    WaitingList.findOne.mockResolvedValue({
      userId: "nextUser",
      destroy: jest.fn(),
    });

    const req = { body: { eventId: "1", userId: "user123" } };
    const res = {};
    await cancelBooking(req, res);

    expect(Booking.create).toHaveBeenCalledWith({
      eventId: "1",
      userId: "nextUser",
    });
    expect(responseHandler.success).toHaveBeenCalledWith(
      res,
      "Booking canceled successfully"
    );
  });
});
