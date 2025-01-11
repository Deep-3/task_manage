const { Sequelize,DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references:{
        model:User,
        key:'id'
    }
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false, 
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, 
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW, 
  }
});

User.hasMany(Notification,{foreignKey:'user_id'});

module.exports=Notification;