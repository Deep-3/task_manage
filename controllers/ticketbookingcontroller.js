const ticketBookingService = require('../services/ticketbookingservices');
const {notifyAllAdmins,notifyCustomer } = require('../services/notificationService');
const Notification=require('../models/notification');
const User=require('../models/user')

/**
 * Book a ticket for an event.
 */
exports.bookTicket = async (req, res) => {
  const { user_id, eventid, tickets_booked } = req.body;

  try {
    const { booking, event } = await ticketBookingService.bookTicket(
      user_id,
      eventid,
      tickets_booked
    );
    const customerMessage = `You have successfully booked ticket ${tickets_booked}".`;

    await Notification.create({
      user_id: user_id,  
      message: customerMessage,
      is_read: false,
    });
    const customers = await User.findAll({
        where: {
          role: ['admin']
        },
        attributes: ['id'], 
      });
    
      // Create a notification for each customer
      const message = `ticket booked by customer ${user_id}`;
      const notifications = customers.map(async (customer) => {
        return Notification.create({
          user_id: customer.id,  
          message,
          is_read: false,  
        });
      });
    
      await Promise.all(notifications);
notifyCustomer(user_id,{
    message: 'A ticket has been booked!',booking:booking.user_id,bookingmsg:booking.message
  })

   notifyAllAdmins({
    message: `A ticket has been booked By customer ${user_id}!`,
    booking:booking.user_id,bookingmsg:booking.message})


    res.status(201).json({ message: 'Ticket booked successfully', booking, event });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Cancel a ticket booking.
 */
exports.cancelBooking = async (req, res) => {
  const { booking_id } = req.params;

  try {
    const booking = await ticketBookingService.cancelBooking(booking_id);

    const customerMessage = `You have successfully cancelled ticket ${tickets_booked}".`;

    await Notification.create({
      user_id: user_id,  
      message: customerMessage,
      is_read: false,
    });
    const customers = await User.findAll({
        where: {
          role: ['admin']
        },
        attributes: ['id'], 
      });
    
      // Create a notification for each customer
      const message = `ticket cancelled by customer ${user_id}`;

      const notifications = customers.map(async (customer) => {
        return Notification.create({
          user_id: customer.id,  
          message,
          is_read: false,  
        });
      });
    
      await Promise.all(notifications);
  
    notifyCustomer(booking.user_id,{
        message: 'A ticket has been cancelled!',
        booking:booking.user_id,bookingmsg:booking.message
    })
    
       notifyAllAdmins({
        message: `A ticket has been cancelled By customer ${booking.user_id}!`,
        booking:booking.user_id,bookingmsg:booking.message})

    res.json({ message: 'Booking canceled successfully', booking });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
