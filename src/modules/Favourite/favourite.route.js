const express = require("express");
const { auth } = require("../../middlewares/auth");
const { addFavourite, myFavourite, unFavourite } = require("./favourite.controller");
const router = express.Router();

router.post("/add", auth(['contractor']), addFavourite);
router.get("/myfavourites", auth(['contractor']), myFavourite);
router.get("/unfavourite/:id", auth(['contractor']), unFavourite);


module.exports = router;