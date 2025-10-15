const express = require("express");
const { addNotification, readNotification, userNotification, businessNotification, adminNotification } = require("./notification.controller");
const { auth } = require("../../middlewares/auth");
const router = express.Router();

router.post("/",  auth(['admin']), addNotification);
router.get("/notification-userend",  auth(['user', 'business', 'admin']), userNotification);
router.get("/notification-businessend",  auth(['user', 'business', 'admin']), businessNotification);
router.get("/notification-adminend",  auth(['admin']), adminNotification);
router.put("/read/:id",  auth(['user', 'business', 'admin']), readNotification);

module.exports = router;