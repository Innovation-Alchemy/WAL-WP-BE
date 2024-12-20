module.exports = (app) => {
    const express = require('express');
    const router = express.Router();
    const paymentController = require('../controllers/payment.controller');
    const authenticate = require('../middleware/authMiddleware');
    const checkPermission = require('../middleware/RBAC.Middleware');
  
    router.get('/payments', authenticate, paymentController.getAllPayments);
    router.get('/payments/:id', authenticate, paymentController.getPaymentById);
    router.post('/payments', authenticate, checkPermission('create-payment'), paymentController.createPayment);
    router.put('/payments/:id', authenticate, checkPermission('update-payment'), paymentController.updatePayment);
    router.delete('/payments/:id', authenticate, checkPermission('delete-payment'), paymentController.deletePayment);
  
    app.use('/api', router);
  };
  