const express = require("express");
const router = express.Router();
const { auth } = require("../../middlewares/auth");
const { addCategoryController, allCategoryController, deleteCategoryController, editCategoryController } = require("./category.controller");

const ensureUploadFolderExists = require("../../helpers/fileExists");
const fileUploadMiddleware = require("../../middlewares/fileUpload");
const UPLOADS_FOLDER = "./public/uploads/category";
const upload = fileUploadMiddleware(UPLOADS_FOLDER);
const convertHeicToPng = require('../../middlewares/converter');
ensureUploadFolderExists(UPLOADS_FOLDER);
const parseData = require("../../middlewares/parseData");


router.post('/add', upload.single('image'), convertHeicToPng(UPLOADS_FOLDER), parseData(), auth(['admin']), addCategoryController);
router.get('/all', allCategoryController);
router.put('/edit/:id', upload.single('image'),convertHeicToPng(UPLOADS_FOLDER),parseData(), auth(['admin']), editCategoryController);
router.delete('/delete/:id', auth(['admin']), deleteCategoryController);

module.exports = router;