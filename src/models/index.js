const { Sequelize, DataTypes } = require("sequelize");
const dbConfig = require("../config/database");

const env = process.env.NODE_ENV || "development"; // Default to "development"
const config = dbConfig[env]; // Pick the correct config

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: config.logging,
  }
);

const models = {
  Event: require("./event")(sequelize, DataTypes),
  Booking: require("./booking")(sequelize, DataTypes),
  WaitingList: require("./waitingList")(sequelize, DataTypes),
};

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
