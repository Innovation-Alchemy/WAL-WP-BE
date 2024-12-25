// Routes for the Profile model
module.exports = (app) => {
    const express = require("express");
    const router = express.Router();
    const profileController = require("../controllers/profile_details.controller");
    const authenticate = require("../middleware/authMiddleware");
    const checkPermission = require("../middleware/RBAC.Middleware");
    const upload = require("../middleware/uploadMiddleware"); // Multer middleware for handling file uploads
  
    router.get("/profiles", authenticate, profileController.getAllProfiles);
    router.get("/profiles/:id", authenticate, profileController.getProfileById);
    router.post(
      "/profiles",
      authenticate,
      upload.fields([
        { name: "profile_picture", maxCount: 1 },
        { name: "cover_photo", maxCount: 1 },
      ]),
      checkPermission("create-profile"),
      profileController.createProfile
    );
    router.put(
      "/profiles/:id",
      authenticate,
      upload.fields([
        { name: "profile_picture", maxCount: 1 },
        { name: "cover_photo", maxCount: 1 },
      ]),
      checkPermission("update-profile"),
      profileController.updateProfile
    );
    router.delete("/profiles/:id", authenticate, checkPermission("delete-profile"), profileController.deleteProfile);
  
    app.use("/api", router);
  };
  