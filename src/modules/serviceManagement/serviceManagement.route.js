const express = require("express");
const { auth } = require("../../middlewares/auth");
const { bookingController } = require("./serviceManagement.controller");
const router = express.Router();

const fileUploadMiddleware = require("../../middlewares/fileUpload");
const UPLOADS_FOLDER = "./public/uploads/booking";
const upload= fileUploadMiddleware(UPLOADS_FOLDER);
const convertHeicToPng = require('../../middlewares/converter');
const ensureUploadFolderExists = require('../../helpers/fileExists');
const parseData = require('../../middlewares/parseData');
ensureUploadFolderExists(UPLOADS_FOLDER);


router.post("/book", upload.fields([{ name: "image", maxCount: 5 }]), convertHeicToPng(UPLOADS_FOLDER),  auth(['contractor']), parseData(),  bookingController);


module.exports = router;