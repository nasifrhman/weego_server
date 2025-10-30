const express = require('express');
const { auth } = require('../../middlewares/auth');
const { addUserEngagementController } = require('./userEngagement.controller');
const router = express.Router();


router.post('/add',auth(['contractor', 'provider']), addUserEngagementController);
// router.get('/my-invoice', auth(['contractor']), myAllInvoiceController);

module.exports = router;