// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontrollers');
const { authenticate, authorize } = require('../middleware/authmiddleware');

// Routes
router.post('/',authenticate,authorize(['superadmin']), userController.createUser);
router.get('/',authenticate,authorize(['superadmin','admin']), userController.getUsers);
router.put('/:id', authenticate,authorize(['superadmin']), userController.updateUser);
router.delete('/:id', authenticate,authorize(['superadmin']), userController.deleteUser);

module.exports = router;
