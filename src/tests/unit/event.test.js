const {
  createEvent,
  getEventStatus,
} = require("../../src/controllers/eventController");
const { Event, WaitingList } = require("../../src/models");
const logger = require("../../src/utils/logger");
const responseHandler = require("../../src/utils/responseHandler");

jest.mock("../../src/models", () => ({
  Event: { create: jest.fn(), findByPk: jest.fn() },
  WaitingList: { count: jest.fn() },
}));

jest.mock("../../src/utils/logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

jest.mock("../../src/utils/responseHandler", () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

describe("Event Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should create an event successfully", async () => {
    const req = { body: { name: "Test Event", totalTickets: 100 } };
    const res = {};

    Event.create.mockResolvedValue({
      id: 1,
      name: "Test Event",
      totalTickets: 100,
      availableTickets: 100,
    });

    await createEvent(req, res);

    expect(Event.create).toHaveBeenCalledWith({
      name: "Test Event",
      totalTickets: 100,
      availableTickets: 100,
    });
    expect(logger.info).toHaveBeenCalledWith("Event created: 1");
    expect(responseHandler.success).toHaveBeenCalledWith(
      res,
      "Event initialized successfully",
      expect.any(Object),
      201
    );
  });

  test("should return error for invalid event details", async () => {
    const req = { body: { name: "", totalTickets: -5 } };
    const res = {};

    await createEvent(req, res);

    expect(responseHandler.error).toHaveBeenCalledWith(
      res,
      "Invalid event details",
      400
    );
  });

  test("should return event status", async () => {
    const req = { params: { eventId: 1 } };
    const res = {};

    Event.findByPk.mockResolvedValue({
      id: 1,
      name: "Test Event",
      availableTickets: 50,
      waitingList: [{ userId: 2 }, { userId: 3 }],
    });

    await getEventStatus(req, res);

    expect(Event.findByPk).toHaveBeenCalledWith(1, {
      include: [{ model: WaitingList, as: "waitingList" }],
    });
    expect(responseHandler.success).toHaveBeenCalledWith(
      res,
      "Event status retrieved",
      {
        eventId: 1,
        name: "Test Event",
        availableTickets: 50,
        waitingListCount: 2,
      }
    );
  });

  test("should return error if event not found", async () => {
    const req = { params: { eventId: 999 } };
    const res = {};

    Event.findByPk.mockResolvedValue(null);

    await getEventStatus(req, res);

    expect(responseHandler.error).toHaveBeenCalledWith(
      res,
      "Event not found",
      404
    );
  });
});
