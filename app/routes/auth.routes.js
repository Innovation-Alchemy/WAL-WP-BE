module.exports = (app) => {
    const express = require("express");
    const router = express.Router();
    const authController = require("../controllers/auth.controller");
    const checkPermission = require('../middleware/RBAC.Middleware');
    const authenticate = require('../middleware/authMiddleware');
    
    // ** Register **
    // does not require authentication or permission because any one can register
    router.post("/auth/register", authController.register);
  
    // ** Verify Email **
    // does not require authentication or permission because every one must verify
    router.get("/auth/verify-email/:token", authController.verifyEmail);

    // render verification page
    // does not require authentication or permission because every one must verify
     router.get('/auth/verify-email/render-verfication/:token', authController.renderVerificationForm);
    
    // ** Verify Email And Set Passowrd **
    // does not require authentication or permission , when an admin  creates a user he must set his password
    router.post("/auth/verify-email/set-password", authController.verifyEmailAndSetPassword);

    // ** Login **
    // does not require authentication or permission because every one must login 
    router.post("/auth/login", authController.login);
  
    // ** Logout **
    // does not require authentication or permission because every can log out
    router.post("/auth/logout", authController.logout);

    // Route to request organizer role
    router.post("/auth/request-organizer", authenticate, authController.requestOrganizerRole);

    // ** Approve **
    router.post("/auth/approve/:id",authenticate,checkPermission('auth-approve'), authController.approveUser);

    // change password 
    router.post("/auth/change-password", authenticate, authController.changePassword);
  
    app.use("/api", router);
  };
  