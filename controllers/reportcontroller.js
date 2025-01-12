const TicketBooking=require('../models/ticketbooking')
const User=require('../models/user');
const Event=require('../models/event')
const moment = require('moment');

const { classReportToCSV,classReportToPDF } = require('../utils/report');
const sequelize = require('../config/db');

exports.generateEventReport = async (req,res) => {
    try {
        const {pdf}=req.params;
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
        if(pdf=='pdf')
        return classReportToPDF(res,reports,'eventreport.hbs','eventreport.pdf')
        else
        return classReportToCSV(res,reports,'eventreport.csv');

        res.json({total:reports})
    } catch (error) {
        console.error('Error generating event report:', error);
        throw error;
    }
};

exports.generateCustomerReport = async (req,res) => {
    try {
        const {pdf}=req.params;
        const report = await TicketBooking.findAll({
            include: [
                { model: User, attributes: ['username', 'email'], where: { role: 'customer' } },
                { model: Event, attributes: ['event_name'] },
            ],
            attributes: ['tickets_booked', 'total_amount'],
        });

        const reports = report.map((item) => ({
            customer_name: item.User.username,
            event_name: item.Event.event_name,
            tickets_booked: item.tickets_booked,
            total_amount: item.total_amount.toFixed(2),
        }));
        if(pdf=='pdf')
        return classReportToPDF(res,reports,'customerreport.hbs','customerreport.pdf')
        else
        return classReportToCSV(res,reports,'customerreport.csv');

        res.json({total:report})
    } catch (error) {
        console.error('Error generating event report:', error);
        throw error;
    }
};


exports.generateRevenueReport = async (req,res) => {
    try {
        const {pdf}=req.params;
        const dailyRevenue = await TicketBooking.findAll({
            attributes: [
                [sequelize.fn('DATE', sequelize.col('booking_date')), 'date'],
                [sequelize.fn('SUM', sequelize.col('total_amount')), 'total_revenue'],
            ],
            group: ['date'],
            raw: true,
        });

        // Fetch Weekly Revenue
        const weeklyRevenue = await TicketBooking.findAll({
            attributes: [
                [sequelize.fn('YEARWEEK', sequelize.col('booking_date')), 'week'],
                [sequelize.fn('SUM', sequelize.col('total_amount')), 'total_revenue'],
            ],
            group: ['week'],
            raw: true,
        });

        // Fetch Monthly Revenue
        const monthlyRevenue = await TicketBooking.findAll({
            attributes: [
                [sequelize.fn('DATE_FORMAT', sequelize.col('booking_date'), '%Y-%m'), 'month'],
                [sequelize.fn('SUM', sequelize.col('total_amount')), 'total_revenue'],
            ],
            group: ['month'],
            raw: true,
        });

        // Create a data object to send to the HBS template
        const reports = {
            daily: dailyRevenue,
            weekly: weeklyRevenue,
            monthly: monthlyRevenue,
            generatedDate: moment().format('MMMM Do YYYY, h:mm:ss a'),
        };
        if(pdf=='pdf')
        return classReportToPDF(res,reports,'revenuereport.hbs','revenuereport.pdf')
        else
        return classReportToCSV(res,reports,'revenuereport.csv');

        res.json({total:report})
    } catch (error) {
        console.error('Error generating event report:', error);
        throw error;
    }
};




   



   

