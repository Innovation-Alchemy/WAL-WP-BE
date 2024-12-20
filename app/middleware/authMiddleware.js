const jwt = require("jsonwebtoken");
const db = require("../models");
require("dotenv").config();

const accountModels = {
  User: db.User,
};

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided, access denied." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { id } = decoded;

    let user = null;
    let modelName = null;

    // Iterate over all account models to find the user
    for (const [key, model] of Object.entries(accountModels)) {
      user = await model.findByPk(id);
      if (user) {
        modelName = key; // Identify which model the user belongs to
        break;
      }
    }

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    req.user = {
      id: user.id,
      model: modelName, // Store the model name for further authorization checks
      permissions: user.permissions || [],
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token.", error: error.message });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired.", error: error.message });
    } else {
      return res.status(500).json({ message: "Server error.", error: error.message });
    }
  }
};

module.exports = authenticate;
