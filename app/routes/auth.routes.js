module.exports = (app) => {
    const express = require("express");
    const router = express.Router();
    const authController = require("../controllers/auth.controller");
  
    // ** Register **
    router.post("/auth/register", authController.register);
  
    // ** Verify Email **
    router.post("/auth/verify-email/:token", authController.verifyEmail);
  
    // ** Login **
    router.post("/auth/login", authController.login);
  
    // ** Logout **
    router.post("/auth/logout", authController.logout);
  
    app.use("/api", router);
  };
  