// const passport = require("passport");
const { tokenGenerator } = require("../../helpers/tokenGenerator");
const catchAsync = require("../../helpers/catchAsync");
const response = require("../../helpers/response");
const { addUser, login, getUserByEmail } = require("./auth.service");
const { sendOTP, verifyOTP, deleteOTP, checkOTPByEmail } = require("../Otp/otp.service");
const { addToken, verifyToken, deleteToken } = require("../Token/token.service");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { default: status } = require("http-status");
const ApiError = require("../../helpers/ApiError");


const localAuth = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await login(email, password);
  user.isLoginToken = true;
  const token = await tokenGenerator(user);
  return res.status(status.OK).json(response({
    statusCode: status.OK,
    message: req.t("login-success"),
    status: "OK",
    data: user,
    accessToken: token,
  }));
});




//Sign up
const signUp = catchAsync(async (req, res) => {
  let otpPurpose = "email-verification";
  let { fullName, email, password, role } = req.body;
  const existingUser = await getUserByEmail(email);
  if (existingUser) throw new ApiError(status.CONFLICT, 'This email already used!')
  const existingOTP = await checkOTPByEmail(email);
  let message = "otp-sent";
  if (existingOTP) {
    message = "otp-exists";
  } else {
    const otpData = await sendOTP(fullName, email, "email", otpPurpose);
    if (otpData) {
      message = "otp-sent";
    }
  }
  const signUpData = { fullName, email, password, role };
  const signUpToken = jwt.sign(signUpData, process.env.JWT_ACCESS_TOKEN, { expiresIn: "1h" });
  return res.status(status.CREATED).json(response({ status: "OK", statusCode: status.CREATED, type: "user", message: req.t(message), signUpToken: signUpToken }));
});



// Validate email
const validateEmail = catchAsync(async (req, res) => {
  const otpData = await verifyOTP(req.User?.email, "email", req.body.purpose, req.body.otp);
  const registeredUser = await addUser(req.User);
  const accessToken = await tokenGenerator(registeredUser);
  await deleteOTP(otpData._id);
  return res.status(status.CREATED).json(response({ status: "OK", statusCode: status.CREATED, type: "user", message: req.t("user-verified"), data: registeredUser, accessToken: accessToken, }));
});


// Forget password
const forgetPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const user = await getUserByEmail(email);
  if (!user) return res.status(status.NOT_FOUND).json(response({ status: "Error", statusCode: "status.NOT_FOUND", type: "user", message: req.t("user-not-exists") }));
  const otpData = await sendOTP(user.fullName, email, "email", "forget-password");
  const payload = {
    _id: user._id,  
    email: user.email,
    fullName: user.fullName,
  };
  const token = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, { expiresIn: "1h" });
  if (otpData) return res.status(status.OK).json(response({ status: "OK", statusCode: status.OK, type: "user", data: token , message: req.t("forgot-password") }));
  return res.status(status.BAD_REQUEST).json(response({ status: "Error", statusCode: status.BAD_REQUEST, type: "user", message: req.t("forgot-password") })
  );
});


// Verify forget password OTP
const verifyForgetPasswordOTP = catchAsync(async (req, res) => {
  const { otp, purpose } = req.body;
  const email = req.User.email;
  const user = await getUserByEmail(email);
  if (!user) {
    return res.status(status.NOT_FOUND).json(response({ status: "Error", statusCode: "status.NOT_FOUND", type: "user", message: req.t("user-not-exists") }));
  }
  const otpVerified = await verifyOTP(email, "email", purpose, otp);
  if (!otpVerified) {
    return res.status(status.BAD_REQUEST).json(response({ status: "Error", statusCode: status.BAD_REQUEST, type: "user", message: req.t("invalid-otp") }));
  }
  const token = crypto.randomBytes(32).toString("hex");
  const data = { token: token, userId: user._id, purpose: "forget-password" };
  await addToken(data);
  return res.status(status.OK).json(response({ status: "OK", statusCode: status.OK, type: "user", message: req.t("otp-verified"), forgetPasswordToken: token, }));
});


const resetPassword = catchAsync(async (req, res) => {
  var forgetPasswordToken;
  if (
    req.headers["forget-password"] &&
    req.headers["forget-password"].startsWith("Forget-password ")
  ) {
    forgetPasswordToken = req.headers["forget-password"].split(" ")[1];
  }
  const tokenData = await verifyToken(forgetPasswordToken, "forget-password");
  if (!tokenData) throw new ApiError(status.BAD_REQUEST, 'Invalid Token')
  const { password } = req.body;
  const user = await getUserByEmail(tokenData.userId.email);
  if (!user) {
    return res.status(status.NOT_FOUND).json(response({ status: "Error", statusCode: status.NOT_FOUND, type: "user", message: req.t("user-not-exists") }));
  }
  user.password = password;
  await user.save();
  await deleteToken(tokenData._id);
  return res.status(status.OK).json(response({ status: "OK", statusCode: status.OK, type: "user", message: req.t("password-reset-success") })
  );
});


const changePassword = catchAsync(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const verifyUser = await login(req.User.email, oldPassword, "changePass");
  if (!verifyUser) {
    return res.status(status.BAD_REQUEST).json(response({ status: "Error", statusCode: status.BAD_REQUEST, type: "user", message: req.t("password-invalid") }));
  }
  verifyUser.password = newPassword;
  await verifyUser.save();
  return res.status(status.OK).json(response({ status: "OK", statusCode: status.OK, type: "user", message: req.t("password-changed"), data: verifyUser })
  );
});

const resendOTP = catchAsync(async (req, res) => {
  const { email } = req.body;
  const user = await getUserByEmail(email);
  const fullName = user?.fullName || "User";
  const otpData = await sendOTP(fullName, email, "email", "resend-otp");
  if (otpData) {
    return res.status(status.OK).json(
      response({
        status: "OK",
        statusCode: status.OK,
        type: "user",
        message: req.t("resend-otp"),
      })
    );
  }
});



module.exports = {
  localAuth,
  signUp,
  validateEmail,
  forgetPassword,
  verifyForgetPasswordOTP,
  resetPassword,
  changePassword,
  resendOTP
};
