module.exports = (app) => {
    const express = require('express');
    const router = express.Router();
    const couponController = require('../controllers/couponController');
    const authenticate = require('../middleware/authMiddleware');
    const checkPermission = require('../middleware/RBACMiddleware');
  
    router.get('/coupons', authenticate, couponController.getAllCoupons);
    router.get('/coupons/:id', authenticate, couponController.getCouponById);
    router.post('/coupons', authenticate, checkPermission('create-coupon'), couponController.createCoupon);
    router.put('/coupons/:id', authenticate, checkPermission('update-coupon'), couponController.updateCoupon);
    router.delete('/coupons/:id', authenticate, checkPermission('delete-coupon'), couponController.deleteCoupon);
  
    app.use('/api', router);
  };
  