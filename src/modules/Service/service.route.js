const express = require('express');
const router = express.Router();
const { auth } = require('../../middlewares/auth');
const { addServiceController, editServiceController, deleteServiceController, aServiceDetails, getAllServiceController } = require('./service.controller');

const fileUploadMiddleware = require("../../middlewares/fileUpload");
const UPLOADS_FOLDER = "./public/uploads/service";
const upload= fileUploadMiddleware(UPLOADS_FOLDER);
const convertHeicToPng = require('../../middlewares/converter');
const ensureUploadFolderExists = require('../../helpers/fileExists');
const parseData = require('../../middlewares/parseData');
const { getAllService } = require('./service.service');
ensureUploadFolderExists(UPLOADS_FOLDER);


router.post('/add', upload.single('image'), convertHeicToPng(UPLOADS_FOLDER),  auth(['provider','contractor', 'admin']), parseData(), addServiceController);
router.put('/edit/:id', upload.single('image'), convertHeicToPng(UPLOADS_FOLDER),  auth(['provider','contractor', 'admin']), parseData(), editServiceController);
router.get('/all', getAllServiceController);
router.get('/details/:id', aServiceDetails);
router.delete('/:id', deleteServiceController);


module.exports = router;