module.exports = (app) => {
    const express = require('express');
    const router = express.Router();
    const hobbyController = require('../controllers/hobby.controller');
    const authenticate = require('../middleware/authMiddleware');
    const checkPermission = require('../middleware/RBAC.Middleware');


    // only admin can create update and delete hobbies
  
    // ** Get all hobbies **
    router.get('/hobbies', authenticate, hobbyController.getAllHobbies);

    // ** Get a specific hobby by ID **
    router.get('/hobbies/:id', authenticate, hobbyController.getHobbyById);

    // ** Add a new hobby **
    router.post('/hobbies', authenticate,checkPermission('create-hobbies'), hobbyController.addHobby);
  
    // ** Assign hobbies to a user **
    router.post('/hobbies/assign/:id', authenticate, hobbyController.assignHobbiesToUser);
  
    // ** Remove hobbies from a user **
    router.post('/hobbies/remove/:id', authenticate, hobbyController.removeHobbiesFromUser);

    // ** Update a hobby **
    router.put('/hobbies/:id', authenticate,checkPermission('update-hobbies'), hobbyController.updateHobby);

    // ** Delete a hobby **
    router.delete('/hobbies/:id', authenticate,checkPermission('delete-hobbies'), hobbyController.deleteHobby);
 
  
    app.use('/api', router);
  };
  