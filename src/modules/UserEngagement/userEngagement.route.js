const express = require('express');
const { auth } = require('../../middlewares/auth');
const { addUserEngagementController, userEngagementHistory, frequentUserEngagementController } = require('./userEngagement.controller');
const router = express.Router();


router.post('/add',auth(['contractor', 'provider']), addUserEngagementController);
router.get('/history', auth(['provider', 'contractor']), userEngagementHistory);
router.get('/frequent-users', auth(['contractor', 'provider']), frequentUserEngagementController);

module.exports = router;