"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Events",
      [
        {
          name: "Tech Conference 2025",
          totalTickets: 100,
          availableTickets: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Music Festival 2025",
          totalTickets: 200,
          availableTickets: 200,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Events", null, {});
  },
};
