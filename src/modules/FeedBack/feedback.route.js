const express = require("express");
const { addFeedbackController, getFeedbackController } = require("./feedback.controller");
const { auth } = require("../../middlewares/auth");
const router = express.Router();

const fileUploadMiddleware = require("../../middlewares/fileUpload");
const UPLOADS_FOLDER = "./public/uploads/feedback";
const upload= fileUploadMiddleware(UPLOADS_FOLDER);
const convertHeicToPng = require('../../middlewares/converter');
const ensureUploadFolderExists = require('../../helpers/fileExists');
const parseData = require('../../middlewares/parseData');
ensureUploadFolderExists(UPLOADS_FOLDER);


router.post("/add", upload.fields([{ name: "image", maxCount: 5 }]), convertHeicToPng(UPLOADS_FOLDER),  auth(['contractor', 'provider']), parseData(), addFeedbackController);
router.get('/all', auth(['admin']), getFeedbackController)


module.exports = router;