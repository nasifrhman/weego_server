const jwt = require('jsonwebtoken');
const catchAsync = require('../helpers/catchAsync');
const { status } = require("http-status");
const { getUserById } = require('../modules/User/user.service');
const ApiError = require('../helpers/ApiError');


const auth = (userRoles) => {
  // console.log(userRoles);
  return catchAsync(async (req, res, next) => {
    const { authorization } = req.headers;
    let token, decodedData;
    if (authorization && authorization.startsWith("Bearer")) {
      token = authorization.split(" ")[1];
      if (token && token !== undefined && token !== null && token !== "null") {
        decodedData = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
      }
    }
    if (!authorization || !decodedData) throw new ApiError(status.UNAUTHORIZED, 'Unauthorized');
    const user = await getUserById(decodedData._id);
    if (!user) throw new ApiError(status.NOT_FOUND, 'Unauthorized User')
    if (userRoles && !userRoles.includes(decodedData.currentRole)) {
      throw new ApiError(status.UNAUTHORIZED, 'You are not authorized');
    }
    req.User = decodedData;
    next();
  });
}


const tokenCheck = catchAsync(async (req, res, next) => {
  const { signuptoken } = req.headers;
  if (signuptoken && signuptoken.startsWith("signUpToken ")) {
    const token = signuptoken.split(" ")[1];
    let decodedData = {};
    if (token && token !== undefined && token !== null && token !== "null") {
      decodedData = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
    }
    console.log({ decodedData });
    req.User = decodedData;
  }
  next();
});



const requirePermission = catchAsync((permission) => {
  return async (req, res, next) => {
    const admin = await adminModel.findOne({ user: req.User._id });
    if (!admin || !admin.categoryPermissions.includes(permission)) {
      return res.status(403).json({ message: 'Permission denied, you are not authorized for that' });
    }
    next();
  };
});



module.exports = { auth, tokenCheck, requirePermission };