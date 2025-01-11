// /services/eventService.js
const Event = require('../models/event');
const User=require('../models/user')
const Notification=require('../models/notification');
const {Sequelize}=require('sequelize');

const {notifyAllCustomer}=require('../services/notificationService')

exports.createEvent = async (eventData) => {
  const { event_name, description, location, date, time, available_tickets, price_per_ticket } = eventData;
  
  const newEvent = await Event.create({
    event_name,
    description,
    location,
    date,
    time,
    available_tickets,
    price_per_ticket,
  });
  const customers = await User.findAll({
    where: {
      role: 'customer', 
    },
    attributes: ['id'], 
  });

  // Create a notification for each customer
  const message = `A new event "${event_name}" has been added!`;
  const notifications = customers.map(async (customer) => {
    return Notification.create({
      user_id: customer.id,  
      message,
      is_read: false,  
    });
  });

  await Promise.all(notifications);
   notifyAllCustomer("new event added");
   return newEvent;

};

exports.updateEvent = async (eventid, eventData) => {
  const event = await Event.findByPk(eventid);
  if (!event) {
    throw new Error('Event not found');
  }

  await event.update(eventData);

  const customers = await User.findAll({
    where: {
      role: 'customer', 
    },
    attributes: ['id'], 
  });

  // Create a notification for each customer
  const message = `A new event "${event_name}" has been updated!`;
  const notifications = customers.map(async (customer) => {
    return Notification.create({
      user_id: customer.id,  
      message,
      is_read: false,  
    });
  });

  await Promise.all(notifications);

  notifyAllCustomer(`new event added`);
  return event;
};

// Delete an event
exports.deleteEvent = async (eventid) => {
  const event = await Event.findByPk(eventid);
  if (!event) {
    throw new Error('Event not found');
  }

  await event.destroy();
  return { message: 'Event deleted successfully' };
};

// Get future events for customers
exports.getFutureEvents = async () => {
  const currentDate = new Date();
  const events = await Event.findAll({
    where: {
      date: {
        [Sequelize.Op.gt]: currentDate,  
      },
    },
  });
  return events;
};
