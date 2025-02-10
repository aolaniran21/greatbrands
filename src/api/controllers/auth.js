const { registerUser, loginUser } = require("../../services/auth");
const responseHandler = require("../../utils/responseHandler");

const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await registerUser(email, password);
    return responseHandler(res, 201, "User registered successfully", { user });
  } catch (error) {
    return responseHandler(res, 400, error.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await loginUser(email, password);
    return responseHandler(res, 200, "Login successful", { token, user });
  } catch (error) {
    return responseHandler(res, 401, error.message);
  }
};

module.exports = { register, login };
