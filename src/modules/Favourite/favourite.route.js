const express = require("express");
const { auth } = require("../../middlewares/auth");
const { addFavourite, unFavourite } = require("./favourite.controller");
const router = express.Router();

router.post("/add", auth(['contractor']), addFavourite);
router.patch("/unfavourite", auth(['contractor']), unFavourite);


module.exports = router;