const express = require("express");
const { auth } = require("../../middlewares/auth");
const { addReportController, getReportController } = require("./report.controller");
const router = express.Router();


const fileUploadMiddleware = require("../../middlewares/fileUpload");
const UPLOADS_FOLDER = "./public/uploads/report";
const upload= fileUploadMiddleware(UPLOADS_FOLDER);
const convertHeicToPng = require('../../middlewares/converter');
const ensureUploadFolderExists = require('../../helpers/fileExists');
const parseData = require('../../middlewares/parseData');
ensureUploadFolderExists(UPLOADS_FOLDER);


router.post("/add", upload.fields([{ name: "image", maxCount: 5 }]), convertHeicToPng(UPLOADS_FOLDER),  auth(['provider','contractor']), parseData(),  addReportController);
router.get('/all', getReportController)


module.exports = router;