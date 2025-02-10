const { sequelize } = require("../models");

const migrate = async () => {
  try {
    console.log("🔄 Checking for model changes and migrating...");

    await sequelize.sync({ alter: true }); // Auto-detect model changes and apply migrations

    console.log("✅ Database migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
};

migrate();
