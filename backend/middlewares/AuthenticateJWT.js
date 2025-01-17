// middleware/authenticate.js
const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.header("Authorization")?.replace("Bearer ", "");
  // console.log(token);
  if (!token) {
    return res
      .status(401)
      .json({ message: "No token provided, authorization denied." });
  }

  try {
    // Verify the token using the JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user data (e.g., userId) to the request object
    req.user = decoded;

    next(); // Continue to the next middleware/route handler
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Invalid or expired token, authorization denied." });
  }
};

module.exports = authenticateJWT;
