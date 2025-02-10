const path = require("path");
const fs = require("fs");
const { Sequelize } = require("sequelize");

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
// Path to the seeders directory
const seedersPath = path.join(__dirname, "../seeders");

// Read all files in the seeders directory
fs.readdirSync(seedersPath).forEach((file) => {
  const seeder = require(path.join(seedersPath, file));
  seeder.up(sequelize.getQueryInterface(), Sequelize); // Pass the queryInterface and Sequelize
});
