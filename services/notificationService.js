const { activeUsers, activeAdmins } = require('../config/socket');
const Notification=require('../models/notification');
// Function to notify a specific customer
async function notifyCustomer(user_id, message) {

  const socket = activeUsers[user_id];
  if (socket) {
    socket.emit('notifications', message);  
    await Notification.update(
        { is_read: true },
        {
          where: { user_id, is_read: false },
        });
    console.log(`Notification sent to customer: ${user_id}`);
  } else {
    console.log(`Customer ${user_id} is not connected`);
  }
}

async function notifyAllCustomer(message) {
   
    for (const [user_id,socket] of Object.entries(activeUsers)) {
    
        socket.emit('notifications', message);  
        await Notification.update(
          { is_read: true },
          {
            where: { user_id, is_read: false },
          });
      }
    console.log(`Notification sent to all Customer`);
  }
// Function to notify all admins
async function notifyAllAdmins(message) {
    for (const [user_id,socket] of Object.entries(activeAdmins)) {
    
        socket.emit('notifications', message);  
        await Notification.update(
          { is_read: true },
          {
            where: { user_id, is_read: false },
          });
      }
  console.log('Notification sent to all admins');
}

module.exports = { notifyCustomer,notifyAllCustomer, notifyAllAdmins };
