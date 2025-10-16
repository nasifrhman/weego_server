const express = require("express");
const router = express.Router();
const { localAuth, signUp, forgetPassword, verifyForgetPasswordOTP, resetPassword, changePassword, resendOTP, emailVerification, emailVerificationForresendOtp, switchAccountController, resendOtpForForgetPassword } = require("./auth.controller");
const { tokenCheck, auth } = require("../../middlewares/auth");



router.post("/signin", localAuth);
router.post("/sign-up", signUp);
router.post("/email-verification", tokenCheck, emailVerification);
router.post("/email-verification-resend-otp", tokenCheck, emailVerificationForresendOtp);
router.post("/forget-password", forgetPassword);
router.post("/verify-otp", tokenCheck, verifyForgetPasswordOTP);
router.post("/resend-otp", resendOTP);
router.post("/verify-resendotp", tokenCheck, resendOtpForForgetPassword);
router.post("/reset-password", resetPassword);
router.patch("/change-password", auth(['provider', 'contractor', 'admin']), changePassword);
router.get('/switch-account', auth(['provider', 'contractor']), switchAccountController)


module.exports = router;

