// services/userService.js
const User= require('../models/user');
const Notification= require('../models/notification');

const bcrypt = require('bcrypt');
const {notifyAllAdmins}=require('../services/notificationService')

exports.createUser = async (userData) => {
 try {
    if (userData.role == 'superadmin') {
        const existingSuperAdmin = await User.findOne({where:{role:userData.role}});
        console.log(existingSuperAdmin);
        if (existingSuperAdmin) {
          return 'A Super Admin already exists';
        }
      }
      const existingSuperAdmin = await User.findOne({where:{username:userData.username}});
      if(existingSuperAdmin)
       return "A user already exit"

  userData.password = await bcrypt.hash(userData.password, 10);
  const user=await User.create(userData);
  if (user.role === 'customer') {
    const customers = await User.findAll({
      where: {
        role: ['admin']
      },
      attributes: ['id'], 
    });
  
    // Create a notification for each customer
    const message = `new customer register ${user.id}`;
    const notifications = customers.map(async (customer) => {
      return Notification.create({
        user_id: customer.id,  
        message,
        is_read: false,  
      });
    });

    await Promise.all(notifications);
    notifyAllAdmins(`New customer registered: ${user.email}`);
  }
  return user;
}
catch(error)
{
    return error;
}
};


exports.updateUser = async (id, userData) => {
  const user=await User.findByPk(id);
  console.log(user);
  user.username=userData.username|| user.username;
  return await user.save();

};

exports.deleteUser = async (id) => {
  return await User.destroy({ where: { id } });
};

exports.getUsers = async (filters = {}) => {
  return await User.findAll({
    include:{
      model:Notification
    }
  });
};
