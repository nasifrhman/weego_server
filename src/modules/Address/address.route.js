const express = require("express");
const { auth } = require("../../middlewares/auth");
const { addAddressController, myAddressController, updateAddressController, deleteAddressController } = require("./address.controller");
const router = express.Router();


router.post("/add", auth(['contractor','provider']), addAddressController);
router.get("/my-address", auth(['contractor','provider']), myAddressController);
router.put("/edit/:id", auth(['contractor','provider']), updateAddressController);
router.delete("/:id", auth(['contractor','provider']), deleteAddressController);


module.exports = router;