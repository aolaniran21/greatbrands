const jwt = require("jsonwebtoken");
const responseHandler = require("../utils/responseHandler");
const { secret } = require("../config/jwt");

module.exports = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return responseHandler.error(res, "Access Denied: No Token Provided", 401);
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), secret);
    req.user = decoded; // Attach user payload to request
    next();
  } catch (error) {
    return responseHandler.error(res, "Invalid Token", 403);
  }
};
