"use strict";
const { v4: uuidv4 } = require("uuid");
const { hashPassword } = require("../utils/passwordUtil");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const events = [
      {
        id: uuidv4(),
        name: "Event 10",
        totalTickets: 1,
        availableTickets: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("Events", events, {});
    const users = [
      {
        id: uuidv4(),
        email: "user100@example.com",
        password: await hashPassword("password"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("Users", users, {});
    const bookings = [
      {
        id: uuidv4(),
        eventId: events[0].id,
        userId: users[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("Bookings", bookings, {});
    await queryInterface.bulkInsert(
      "WaitingLists",
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
    await queryInterface.bulkDelete("WaitingLists", null, {});
  },
};
