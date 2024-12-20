const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

function generateToken(account) {
  const token = jwt.sign(
    { id: account.id, email: account.email, role: account.role }, // Payload
    JWT_SECRET, // Secret key from environment variables
    { expiresIn: "7d" } // Token expiration time (7 days)
  );

  const TokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
  return { token, TokenExpires };
}

module.exports = { generateToken };
