const express = require("express");
const { addFeedbackController, getFeedbackController } = require("./feedback.controller");
const { auth } = require("../../middlewares/auth");
const router = express.Router();

router.post("/add", auth(['provider', 'contractor']), addFeedbackController);
router.get('/all', auth(['admin']), getFeedbackController)

module.exports = router;