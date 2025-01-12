const express = require('express');
const app = express();
const userRoutes = require('./routes/userroutes');
const loginRoutes = require('./routes/loginroutes');
const eventRoutes=require('./routes/eventroutes')
const ticketBookingRoutes=require('./routes/ticketbookingroutes')
const reportRoutes=require('./routes/reportroutes')
const {socketSetup} = require('./config/socket');
const cors = require('cors');

app.use(cors());
app.use(express.json());

//routes
app.use('/users', userRoutes);
app.use('/auth', loginRoutes);
app.use('/event',eventRoutes);
app.use('/ticket-booking', ticketBookingRoutes);
app.use('/report',reportRoutes);

//server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

socketSetup(server);
