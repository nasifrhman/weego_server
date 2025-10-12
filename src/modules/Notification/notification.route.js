const express = require("express");
const { readNotification, userNotification, adminNotification, readAdminEndNotification, unreadCountAdminNotification } = require("./notification.controller");
const { auth } = require("../../middlewares/auth");
const router = express.Router();

router.get("/notification-userend",  auth(['user']), userNotification);
router.get("/unread-count",  auth(['admin']), unreadCountAdminNotification);
router.get("/notification-adminend", auth(['admin']), adminNotification);
router.patch("/read-admin", auth(['admin']), readAdminEndNotification);
router.put("/read/:id", auth(['user', 'admin']), readNotification);

module.exports = router;