// /config/socket.js
const { Server } = require('socket.io');
const jwt=require('jsonwebtoken')
const Notification=require('../models/notification')
let io;
const activeUsers={};
const activeAdmins={};
let userid;
const socketSetup = (server) => {
  io = new Server(server);

  // Handle socket connections
  io.on('connection', (socket) => {
    //   console.log('connected')

        const token = socket.handshake.headers['token'];
        const decoded = jwt.verify(token,"hellodeep");
        socket.user = decoded;
              if (decoded.userrole == 'admin') {
               
              socket.on('register',(user_id)=>{
                activeAdmins[user_id] = socket;
                sendUnreadNotifications(user_id, socket);

              });

            console.log('Admin connected:',socket.id);

          }
          else if(decoded.userrole=='superadmin')
            console.log('super Admin connected:',socket.id);
          else
          {
            socket.on('register', (user_id) => {
              activeUsers[user_id] = socket;
              sendUnreadNotifications(user_id, socket);
              console.log(`customer registered: ${user_id}`);
            });
          }

          // User is an Admin, now you can store the user's info in the socket object
    
          socket.on('disconnect', () => {
            for (const [userId, userSocket] of Object.entries(activeUsers)) {
              if (userSocket.id === socket.id) {
                delete activeUsers[userId];
                console.log(`User disconnected: ${userId}`);
                break;
              }
            }
            for (const [userId, adminSocket] of Object.entries(activeAdmins)) {
              if (adminSocket.id === socket.id) {
                delete activeAdmins[userId];
                console.log(`Admin disconnected: ${userId}`);
                break;
              }
            }
          });

  });
};

async function sendUnreadNotifications(user_id, socket) {
  const notifications = await Notification.findAll({
    where: { user_id, is_read: false },
    order: [['created_at', 'ASC']],
  });

  if (notifications.length > 0) {
    // Mark notifications as read in the database
    await Notification.update(
      { is_read: true },
      {
        where: { user_id, is_read: false },
      }
    );

    notifications.forEach((notification)=>{
      socket.emit('notifications',notification.message)
    });
  }
}


module.exports = { socketSetup,activeUsers,activeAdmins};
