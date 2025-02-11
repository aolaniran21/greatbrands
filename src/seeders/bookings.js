"use strict";

const { v4: uuidv4 } = require("uuid");
const { hashPassword } = require("../utils/passwordUtil");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const events = [
      {
        id: uuidv4(),
        name: "Event 1",
        totalTickets: 100,
        availableTickets: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("Events", events, {});

    // Use await to ensure password is hashed before insertion
    const users = [
      {
        id: uuidv4(),
        email: "user11@example.com",
        password: await hashPassword("password"), // Await here
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("Users", users, {});
    await queryInterface.bulkInsert(
      "Bookings",
      [
        {
          id: uuidv4(),
          eventId: events[0].id,
          userId: users[0].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          eventId: events[0].id,
          userId: users[0].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Bookings", null, {});
  },
};
