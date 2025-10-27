const express = require("express");
const { auth } = require("../../middlewares/auth");
const { deleteFolder, myFolder, addFolder } = require("./folder.controller");
const router = express.Router();

router.post("/add", auth(['contractor']), addFolder);
router.get("/myfolder", auth(['contractor']), myFolder);
router.delete("/delete/:folderId", auth(['contractor']), deleteFolder);


module.exports = router;