module.exports = (app) => {
    const express = require('express');
    const router = express.Router();
    const combinedDataController = require('../controllers/combined_api_data_for_pages');
    const authenticate = require('../middleware/authMiddleware');
    const checkPermission = require('../middleware/RBAC.Middleware');

    // evryone can see categories so no need for permissions
    router.get('/combined-data/admin-panel-data', authenticate, combinedDataController.getAdminPanelData);

  
    app.use('/api', router);
  };
  