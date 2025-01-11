const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: false},
  password: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false,unique:true },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Email cannot be empty',
      },
      isEmail: {
        msg: 'Please provide a valid email address',
      }
    }
},
  mobileno: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Mobile number cannot be empty',
      },
      isNumeric: {
        msg: 'Mobile number must contain only digits',
      },
      len: {
        args: [10, 10],
        msg: 'Mobile number must be exactly 10 digits',
      }
    }
},
  role: { type: DataTypes.ENUM('superadmin','admin','customer'), allowNull: false },
});

module.exports = User;
