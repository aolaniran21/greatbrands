"use strict";

const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Bookings",
      [
        {
          eventId: uuidv4(),
          userId: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          eventId: uuidv4(),
          userId: uuidv4(),
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
