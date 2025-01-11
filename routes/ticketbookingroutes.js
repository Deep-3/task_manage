const express = require('express');
const ticketBookingController = require('../controllers/ticketbookingcontroller');
const { authenticate, authorize } = require('../middleware/authmiddleware');

const router = express.Router();

router.post('/',authenticate,authorize(['customer']), ticketBookingController.bookTicket);
router.delete('/cancel/:booking_id',authenticate,authorize(['customer']), ticketBookingController.cancelBooking);

module.exports = router;
