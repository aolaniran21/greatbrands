const request = require("supertest");
const app = require("../../app");
const { sequelize, Event, Booking, User } = require("../../models");

describe("Booking API", () => {
  let event;
  let user;
  let token;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    user = await User.create({ email: "test@example.com", password: "123456" });
    token = "Bearer some-valid-token"; // Mocked token

    event = await Event.create({
      name: "Test Event",
      totalTickets: 100,
      availableTickets: 2,
    });
  });

  test("should book a ticket successfully", async () => {
    const response = await request(app)
      .post("/book")
      .set("Authorization", token)
      .send({ eventId: event.id, userId: user.id });

    console.log("Response status:", response.status);
    console.log("Response body:", response.body);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Ticket booked successfully");
  });

  test("should add user to waiting list when event is full", async () => {
    await Event.update({ availableTickets: 0 }, { where: { id: event.id } });

    const response = await request(app)
      .post("/book")
      .set("Authorization", token)
      .send({ eventId: event.id, userId: user.id });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Event sold out, added to waiting list");
  });

  test("should cancel booking and update available tickets", async () => {
    await Booking.create({ eventId: event.id, userId: user.id });

    const response = await request(app)
      .delete("/cancel")
      .set("Authorization", token)
      .send({ eventId: event.id, userId: user.id });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Booking canceled successfully");
  });

  afterAll(async () => {
    await sequelize.close();
  });
});
