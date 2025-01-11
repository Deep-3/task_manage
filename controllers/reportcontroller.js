const TicketBooking=require('../models/ticketbooking')
const Event=require('../models/event')
const { classReportToPDF } = require('../utils/eventreport');
const sequelize = require('../config/db');

exports.generateEventReport = async (req,res) => {
    try {
        const report = await Event.findAll({
            attributes: [
                'event_name',
                [sequelize.fn('SUM', sequelize.col('TicketBookings.tickets_booked')), 'tickets_sold'],
                [sequelize.fn('SUM', sequelize.col('TicketBookings.total_amount')), 'revenue'],
            ],
            include: [
                {
                    model: TicketBooking,
                    attributes:[],
                },
            ],
            group: ['Event.eventid'],
        });

       const reports= report.map(event => ({
            event_name: event.event_name,
            tickets_sold: event.dataValues.tickets_sold || 0,
            revenue: event.dataValues.revenue || 0,
        }));
        return classReportToPDF(res,reports,'eventreport.hbs','eventreport.pdf')
        res.json({total:reports})
    } catch (error) {
        console.error('Error generating event report:', error);
        throw error;
    }
};

   

