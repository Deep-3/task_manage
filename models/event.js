// /models/eventModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Event = sequelize.define('Event', {
    eventid:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
  event_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  time: {
    type: DataTypes.STRING, // Use STRING to store "HH:MM AM/PM"
    allowNull: false,
    validate: {
      is: /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/ // Regex validation for time
    }
  },
  available_tickets: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  price_per_ticket: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  sold_out: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Event;
