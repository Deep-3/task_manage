const reportcontroller=require('../controllers/reportcontroller')
const express = require('express');
const router = express.Router();
const {authenticate,authorize}=require('../middleware/authmiddleware');

router.get('/classreport/pdf',authenticate,authorize(['admin','superadmin']),reportcontroller.generateEventReport)

module.exports=router;