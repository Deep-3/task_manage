const TicketBooking = require('../models/ticketbooking');
const Event = require('../models/event');

/**
 * Book a ticket for an event.
 */
async function bookTicket(user_id, eventid, tickets_booked) {
  const event = await Event.findByPk(eventid);
  if (!event) {
    throw new Error('Event not found');
  }

  if (event.available_tickets < tickets_booked) {
    throw new Error('Not enough tickets available');
  }

  const total_amount = tickets_booked * event.price_per_ticket;

  event.available_tickets -= tickets_booked;
  if (event.available_tickets === 0) {
    event.sold_out = true;
  }
  await event.save();

  const booking = await TicketBooking.create({
    user_id,
    eventid,
    tickets_booked,
    total_amount,
  });

  return { booking, event };
}

/**
 * Cancel a ticket booking.
 */
async function cancelBooking(booking_id) {
  const booking = await TicketBooking.findByPk(booking_id);
  if (!booking) {
    throw new Error('Booking not found');
  }

  const event = await Event.findByPk(booking.eventid);
  if (event) {
    event.available_tickets += booking.tickets_booked;
    if (event.sold_out) {
      event.sold_out = false;
    }
    await event.save();
  }

  await booking.destroy();
  return booking;
}

module.exports = {
  bookTicket,
  cancelBooking,
};
