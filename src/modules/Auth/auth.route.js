const express = require("express");
const router = express.Router();
const { localAuth, signUp, validateEmail, forgetPassword, verifyForgetPasswordOTP, resetPassword, changePassword, resendOTP } = require("./auth.controller");
const { tokenCheck, auth } = require("../../middlewares/auth");



router.post("/signin", localAuth);
router.post("/sign-up", signUp);
router.post("/resend-otp", resendOTP);
router.post("/verify-email", tokenCheck, validateEmail);
router.post("/forget-password", forgetPassword);
router.post("/verify-otp",tokenCheck, verifyForgetPasswordOTP);
router.post("/reset-password", resetPassword);
router.patch("/change-password", auth(['user', 'admin']), changePassword);


module.exports = router;

