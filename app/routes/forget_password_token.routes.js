module.exports = (app) => {
    const express = require("express");
    const router = express.Router();
    const PasswordResetToken = require("../controllers/forget-reset-password.controller");

    // ** Forget Password **
    // Does not require authentication or permission because anyone can request a password reset
    router.post("/forget-password", PasswordResetToken.forgetPassword);

    // ** Reset Password **
    // Does not require authentication or permission because anyone with a valid token can reset their password
    router.post("/reset-password", PasswordResetToken.resetPassword);

    app.use("/api", router);
};
