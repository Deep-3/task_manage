const pdf = require('html-pdf');
const hbs = require('handlebars');
const fs = require('fs');
const path = require('path');
const Notification=require('../models/notification');
const User=require('../models/user')
const {notifyAllAdmins}=require('../services/notificationService')


exports.classReportToPDF = async(res, data,templateName, filename) => {
    console.log(__dirname);
    const templatePath = path.resolve(__dirname, `../templates/${templateName}`);
    console.log(templatePath);
    const templateHtml = fs.readFileSync(templatePath, 'utf-8');
    const compiledTemplate = hbs.compile(templateHtml);
    const html=compiledTemplate({
      data
    }
    );
   

    pdf.create(html).toStream((err, stream) => {
        if (err) return res.status(500).send('Failed to generate PDF');
        res.attachment(filename);
        stream.pipe(res);
    });

    const message = `new report generated ${filename}".`;

  
    const customers = await User.findAll({
        where: {
          role: ['admin']
        },
        attributes: ['id'], 
      });

      const notifications = customers.map(async (customer) => {
        return Notification.create({
          user_id: customer.id,  
          message,
          is_read: false,  
        });
      });
    
      await Promise.all(notifications);
    
    notifyAllAdmins({
      message: `New report generated!`})

  
};