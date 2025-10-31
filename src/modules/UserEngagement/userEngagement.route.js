const express = require('express');
const { auth } = require('../../middlewares/auth');
const { addUserEngagementController, providerEndHistory, contractorEndHistory, frequentUserContractorEndController, frequentUserProviderEndController } = require('./userEngagement.controller');
const router = express.Router();


router.post('/add',auth(['contractor', 'provider']), addUserEngagementController);
router.get('/history-providerend', auth(['provider']), providerEndHistory);
router.get('/history-contractor', auth(['contractor']), contractorEndHistory );
router.get('/frequent-users-contractorend', auth(['contractor']), frequentUserContractorEndController);
router.get('/frequent-users-providerend', auth(['provider']), frequentUserProviderEndController);

module.exports = router;