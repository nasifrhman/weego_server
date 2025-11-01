const express = require('express');
const router = express.Router();
const { auth } = require('../../middlewares/auth');
const { addServiceController, editServiceController, deleteServiceController, aServiceDetails, getAllServiceController, serviceByCategoryController, getAllDiscountServiceController, fetchServicesWithDiscount, getAllForUserServiceController, getAllRecentServiceController, getAllSavedServiceController } = require('./service.controller');

const fileUploadMiddleware = require("../../middlewares/fileUpload");
const UPLOADS_FOLDER = "./public/uploads/service";
const upload= fileUploadMiddleware(UPLOADS_FOLDER);
const convertHeicToPng = require('../../middlewares/converter');
const ensureUploadFolderExists = require('../../helpers/fileExists');
const parseData = require('../../middlewares/parseData');
ensureUploadFolderExists(UPLOADS_FOLDER);


router.get('/admin/all', getAllServiceController);
router.get('/user/all', getAllForUserServiceController);
router.get('/recent/all', getAllRecentServiceController);
router.get('/saved/all',auth(['contractor']), getAllSavedServiceController);
router.post('/add', upload.fields([{ name: "image", maxCount: 10 }]), convertHeicToPng(UPLOADS_FOLDER),  auth(['provider','contractor', 'admin']), parseData(), addServiceController);
router.put('/edit/:id', upload.fields([{ name: "image", maxCount: 10 }]), convertHeicToPng(UPLOADS_FOLDER),  auth(['provider','contractor', 'admin']), parseData(), editServiceController);
router.get('/all-discount', fetchServicesWithDiscount);
router.get('/details/:id', aServiceDetails);
router.get('/searchByCategory/:categoryId', serviceByCategoryController);
router.delete('/:id', deleteServiceController);


module.exports = router;