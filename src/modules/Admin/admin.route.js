const express = require('express');
const { auth } = require('../../middlewares/auth')
const { addAdminController, allAdminController } = require('./admin.controller');
const router = express.Router();

router.post('/add', auth(['admin']), addAdminController);
router.get('/all', auth(['user', 'business', 'admin']), allAdminController);
// router.get('/admin/:adminId', anAdminDetailsController)

module.exports = router;