module.exports = (app) => {
    const express = require("express");
    const router = express.Router();
    const advertisementController = require("../controllers/advertisement.controller");
    const authenticate = require("../middleware/authMiddleware");
    const checkPermission = require("../middleware/RBAC.Middleware");
    const upload = require("../middleware/uploadMiddleware"); // Multer config
  
    // Get all ads
    router.get("/ads",  advertisementController.getAllAds);
  
    // Get ad by ID
    router.get("/ads/:id",  advertisementController.getAdById);
  
    // Create ad (upload up to 5 files)
    router.post(
      "/ads",
      authenticate,
      checkPermission("create-advertisements"),
      upload.array("images", 5),
      advertisementController.createAd
    );
  
    // Update ad (upload up to 5 files)
    router.put(
      "/ads/:id",
      authenticate,
      checkPermission("update-advertisements"),
      upload.array("images", 5),
      advertisementController.updateAd
    );
  
    // Delete ad
    router.delete(
      "/ads/:id",
      authenticate,
      checkPermission("delete-advertisements"),
      advertisementController.deleteAd
    );
  
    app.use("/api", router);
  };
  