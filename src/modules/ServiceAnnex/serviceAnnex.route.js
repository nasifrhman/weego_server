const express = require("express");
const { auth } = require("../../middlewares/auth");
const { newRequestController, requestContructorEndController, editRequestController } = require("./serviceAnnex.controller");
const router = express.Router();

router.post("/add", auth(['provider', 'contractor']), newRequestController);
router.get("/request-contructor-end", auth(['provider', 'contractor']), requestContructorEndController);
router.put("/edit/:id", auth(['provider', 'contractor']), editRequestController);


module.exports = router;