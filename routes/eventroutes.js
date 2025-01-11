// /routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventcontrollers');
const { authenticate, authorize } = require('../middleware/authmiddleware');

router.post('/',authenticate,authorize(['superadmin','admin']),eventController.createEvent);          // Create a new event
router.put('/:id',authenticate,authorize(['superadmin','admin']), eventController.updateEvent);       // Update an event
router.delete('/:id',authenticate,authorize(['superadmin','admin']), eventController.deleteEvent);    // Delete an event
router.get('/',authenticate,authorize(['superadmin','admin','customer']), eventController.getFutureEvents); // Get all future events

module.exports = router;
