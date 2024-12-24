module.exports = (app) => {
    const express = require("express");
    const router = express.Router();
    const authController = require("../controllers/auth.controller");
  
    // ** Register **
    router.post("/auth/register", authController.register);
  
    // ** Verify Email **
    router.get("/auth/verify-email/:token", authController.verifyEmail);

    // render verification page
     router.get('/auth/verify-email/render-verfication/:token', authController.renderVerificationForm);
    
    // ** Verify Email And Set Passowrd **
    router.post("/auth/verify-email/set-password", authController.verifyEmailAndSetPassword);

    // ** Login **
    router.post("/auth/login", authController.login);
  
    // ** Logout **
    router.post("/auth/logout", authController.logout);

    // ** Approve **
    router.post("/auth/approve/:id", authController.approveUser);
  
    app.use("/api", router);
  };
  