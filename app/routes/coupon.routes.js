module.exports = (app) => {
    const express = require('express');
    const router = express.Router();
    const couponController = require('../controllers/coupon.controller');
    const authenticate = require('../middleware/authMiddleware');
    const checkPermission = require('../middleware/RBAC.Middleware');


// only admin can create a coupon update and delete it  
    router.get('/coupons', authenticate, couponController.getAllCoupons);
    router.get('/coupons/:id', authenticate, couponController.getCouponById);
    router.post('/coupons', authenticate, checkPermission('create-coupon'), couponController.createCoupon);
    router.post("/coupons/apply",authenticate, couponController.applyCoupon);
    router.put('/coupons/:id', authenticate, checkPermission('update-coupon'), couponController.updateCoupon);
    router.delete('/coupons/delete/:id', authenticate, checkPermission('delete-coupon'), couponController.deleteCoupon);
  
    app.use('/api', router);
  };
  