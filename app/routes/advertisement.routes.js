module.exports = (app) => {
    const express = require('express');
    const router = express.Router();
    const advertisementController = require('../controllers/advertisement.controller');
    const authenticate = require('../middleware/authMiddleware');
    const checkPermission = require('../middleware/RBAC.Middleware');
  
    router.get('/ads', authenticate, advertisementController.getAllAds);
    router.get('/ads/:id', authenticate, advertisementController.getAdById);
    router.post('/ads', authenticate, checkPermission('create-ad'), advertisementController.createAd);
    router.put('/ads/:id', authenticate, checkPermission('update-ad'), advertisementController.updateAd);
    router.delete('/ads/:id', authenticate, checkPermission('delete-ad'), advertisementController.deleteAd);
  
    app.use('/api', router);
  };
  