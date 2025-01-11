const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Event = require('./event');
const User=require('./user');

const TicketBooking = sequelize.define('TicketBooking', {
  booking_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, 
      key: 'id',
    },
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE',
  },
  eventid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Event, 
      key: 'eventid',
    },
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE',
  },
  tickets_booked: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  total_amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  booking_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: true,
});

// Association
TicketBooking.belongsTo(Event, { foreignKey: 'eventid' });
Event.hasMany(TicketBooking,{foreignKey:'eventid'});

TicketBooking.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(TicketBooking,{foreignKey:'user_id'});

module.exports = TicketBooking;
