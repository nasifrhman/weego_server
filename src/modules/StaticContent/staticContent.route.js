const express = require('express');
const { upgradeStaticContent, getAllStaticContent } = require('./staticContent.controller');
const router = express.Router();
const { auth } = require('../../middlewares/auth');

router.post('/',   auth(['admin']), upgradeStaticContent);
router.get('/', auth(['user', 'business', 'admin']), getAllStaticContent);

module.exports = router;