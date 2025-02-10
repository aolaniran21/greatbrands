const { sequelize } = require("../models");

beforeAll(async () => {
  await sequelize.sync({ force: true }); // Reset database before tests
});

afterAll(async () => {
  await sequelize.close();
});
