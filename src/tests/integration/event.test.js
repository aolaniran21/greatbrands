const request = require("supertest");
const app = require("../../src/app");
const { sequelize, Event, User } = require("../../src/models");

describe("Event API", () => {
  let user;
  let token;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    user = await User.create({ email: "test@example.com", password: "123456" });
    token = "Bearer some-valid-token"; // Mocked token
  });

  test("should create an event successfully", async () => {
    const response = await request(app)
      .post("/api/events")
      .set("Authorization", token)
      .send({ name: "Test Event", totalTickets: 100 });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Event initialized successfully");
  });

  test("should return event status", async () => {
    const event = await Event.create({
      name: "Test Event",
      totalTickets: 100,
      availableTickets: 50,
    });

    const response = await request(app)
      .get(`/api/events/${event.id}`)
      .set("Authorization", token);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("eventId", event.id);
    expect(response.body.data).toHaveProperty("availableTickets", 50);
  });

  test("should return 404 if event not found", async () => {
    const response = await request(app)
      .get("/api/events/999")
      .set("Authorization", token);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Event not found");
  });

  afterAll(async () => {
    await sequelize.close();
  });
});
