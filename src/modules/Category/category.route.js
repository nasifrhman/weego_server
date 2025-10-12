const express = require("express");
const router = express.Router();
const { auth } = require("../../middlewares/auth");
const { addCategoryController, allCategoryController, deleteCategoryController, editCategoryController } = require("./category.controller");

const fileUploadMiddleware = require("../../middlewares/fileUpload");
const UPLOADS_FOLDER = "./public/uploads/category";
const upload = fileUploadMiddleware(UPLOADS_FOLDER);
const parseData = require("../../middlewares/parseData");


router.post('/add', upload.single('image'),parseData(), auth(['admin']), addCategoryController);
router.get('/all', allCategoryController);
router.put('/edit/:id', upload.single('image'),parseData(), auth(['admin']), editCategoryController);
router.delete('/delete/:id', auth(['admin']), deleteCategoryController);

module.exports = router;