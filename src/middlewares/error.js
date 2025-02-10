const responseHandler = require("../utils/responseHandler");

module.exports = (err, req, res, next) => {
  console.error("❌ Error:", err.message);

  if (err.name === "SequelizeValidationError") {
    return responseHandler.error(
      res,
      err.errors.map((e) => e.message).join(", "),
      400
    );
  }

  return responseHandler.error(
    res,
    err.message || "Internal Server Error",
    err.status || 500
  );
};
