const express = require("express");
const { auth } = require("../../middlewares/auth");
const { addFavourite, myFavourite, unFavourite } = require("./favourite.controller");
const router = express.Router();

router.post("/add",  auth(['user']), addFavourite);
router.get("/myfavourites",  auth(['user']), myFavourite);
router.get("/unfavourite/:id",  auth(['user']), unFavourite);

module.exports = router;