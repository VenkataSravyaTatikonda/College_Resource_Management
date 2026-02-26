const jwt = require("jsonwebtoken");
const ApiResponse = require("../utils/ApiResponse");

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return ApiResponse.unauthorized("Token required").send(res);
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded);

    req.userId = decoded.userId;
    req.userRole = decoded.role; // 👈 future use (faculty/admin/student)
    next();
  } catch (error) {
    console.error("JWT Error:", error.message);

    return ApiResponse.unauthorized(
      "Session expired. Please login again"
    ).send(res);
  }
};

module.exports = auth;
