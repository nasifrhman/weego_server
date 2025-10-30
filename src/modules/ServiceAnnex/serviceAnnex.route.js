const express = require("express");
const { auth } = require("../../middlewares/auth");
const { newRequestController, requestcontractorEndController, editRequestController } = require("./serviceAnnex.controller");
const router = express.Router();

router.post("/add", auth(['provider', 'contractor']), newRequestController);
router.get("/request-contractor-end", auth(['provider', 'contractor']), requestcontractorEndController);
router.put("/edit/:id", auth(['provider', 'contractor']), editRequestController);


module.exports = router;