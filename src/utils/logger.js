const winston = require("winston");

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  })
);

// Logger instance
const logger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [
    new winston.transports.Console(), // Log to console
    new winston.transports.File({ filename: "logs/app.log" }), // Log to file
  ],
});

module.exports = logger;
