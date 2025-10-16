const { default: status } = require("http-status");
const catchAsync = require('../../helpers/catchAsync')
const response = require("../../helpers/response");
const unlinkImage = require('../../helpers/unlinkImage')
const { getUserById, getUsers, updateUser, getMonthlyUserRatio, getUserProfile, calculateCount, unbanUserService, banUserService, updateUserById, changeCurrentTrainningService, deleteAccountService, calculateCountUserService, calculateSubscriptionCount, getreferralCode, getDeletedUsers } = require('./user.service');
const ApiError = require("../../helpers/ApiError");
const bcrypt = require('bcryptjs');
const { getTotalEarning } = require("../Transaction/transaction.service");
const { updatePrivacyService, togglePrivacySetting, myPrivacyService } = require("../Privacy/privacy.service");




//Get user details
const userDetails = catchAsync(async (req, res) => {
  const userDetails = await getUserProfile(req.User._id);
  return res.status(status.OK).json(response({ statusCode: status.OK, message: req.t('details'), data: userDetails, status: "OK" }));
})


const deleteUserAccount = catchAsync(async (req, res) => {
  const password = req.body.password;
  const user = await getUserById(req.User._id);
  if (!password) throw new ApiError(status.BAD_REQUEST, 'password-required');
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) throw new ApiError(status.UNAUTHORIZED, 'password-not-match');
  req.body.user = req.User._id;
  //Remove password before passing body
  delete req.body.password;
  const data = await deleteAccountService(req.body);
  return res.status(status.OK).json({
    status: 'OK',
    statusCode: status.OK,
    message: 'Account Deleted successfully',
    data: data,
  });
});


const countController = catchAsync(async (req, res) => {
  const userCount = await calculateCountUserService();
  const totalEarning = await getTotalEarning();
  const subscription = await calculateSubscriptionCount()
  return res.status(status.OK).json(response({
    statusCode: status.OK, message: 'count', status: "OK", data: {
      userCount,
      totalEarning,
      subscription
    }
  }));
})


const seeOwnReferalCode = catchAsync(async (req, res) => {
  const data = await getreferralCode(req.User._id);
  return res.status(status.OK).json(response({ status: 'Success', statusCode: status.OK, type: 'user', message: 'your referal code', data: data }));
})


const userDetailsByID = catchAsync(async (req, res) => {
  const userDetails = await getUserProfile(req.params.id);
  return res.status(status.OK).json(response({ statusCode: status.OK, message: req.t('details'), data: userDetails, status: "OK" }));
})


const updatePrivacyController = catchAsync(async (req, res) => {
  const userDetails = await togglePrivacySetting(req.User._id, req.body.field);
  return res.status(status.OK).json(response({ statusCode: status.OK, message: req.t('privacy-policy-updated'), data: userDetails, status: "OK" }));
})



const updateProfile = catchAsync(async (req, res) => {
  const user = await getUserById(req.User._id);
  if (!user) throw new ApiError(status.NOT_FOUND, 'user-not-found');
  if (req.file) {
    const { filename } = req.file;
    if (filename && filename.length > 0) {
      const defaultPath1 = '/uploads/users/user.png';
      const defaultPath2 = '/uploads/users/user.jpg';
      if (user.image !== defaultPath1 && user.image !== defaultPath2) {
        unlinkImage(user.image);
      }
      req.body.image = `/uploads/users/${filename}`;
    }
  }
  const updatedUser = await updateUserById(user._id, req.body);
  return res.status(status.OK).json(response({
    status: 'OK',
    statusCode: status.OK,
    type: 'user',
    message: req.t('user-updated'),
    data: updatedUser
  }));
});


// Get all users
const allUsers = catchAsync(async (req, res) => {
  let filters = { role: 'user' };
  const options = {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10
  };

  const search = req.query.search;
  if (search && search !== 'null' && search !== '' && search !== undefined) {
    const searchRegExp = new RegExp('.*' + search + '.*', 'i');
    filters.$or = [
      { fullName: { $regex: searchRegExp } },
      { email: { $regex: searchRegExp } },
    ];
  }
  const users = await getUsers(filters, options);
  return res.status(status.OK).json(response({ statusCode: status.OK, message: req.t('users-list'), type: "user", data: users, status: 'OK' }));
});


const myPrivacyController = catchAsync(async (req, res) => {
  const data = await myPrivacyService(req.User._id);
  return res.status(status.OK).json(response({ statusCode: status.OK, data: data, status: "OK" , type:"user"}));
});


// Get all users
const allDeletedAccount = catchAsync(async (req, res) => {
  let filters = { isDeleted:true };
  const options = {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10
  };

  const search = req.query.search;
  if (search && search !== 'null' && search !== '' && search !== undefined) {
    const searchRegExp = new RegExp('.*' + search + '.*', 'i');
    filters.$or = [
      { fullName: { $regex: searchRegExp } }
    ];
  }
  const users = await getDeletedUsers(filters, options);
  return res.status(status.OK).json(response({ statusCode: status.OK, message: req.t('users-list'), data: users, status: 'OK' }));
});



//Get user to  ratio
const userRatio = catchAsync(async (req, res) => {
  let year = Number(req.query.year) || new Date().getFullYear();
  const ratio = await getMonthlyUserRatio(year);

  return res.status(status.OK).json(
    response({
      statusCode: status.OK,
      message: req.t('user-ratio'),
      data: ratio,
      status: 'ok',
    })
  );
});


const banUserController = catchAsync(async (req, res) => {
  const user = await banUserService(req.params.userId, { isBan: true });
  return res.status(status.OK).json(response({ status: 'Success', statusCode: status.OK, type: 'user', message: req.t('user-banned'), data: user }));
})


const completeProfileController = catchAsync(async (req, res) => {
  req.body.isComplete = true;
  const user = await updateUserById(req.User._id, req.body);
  return res.status(status.OK).json(response({ status: 'Success', statusCode: status.OK, type: 'user', message: 'complete Profile', data: user }));
})


const Count = catchAsync(async (req, res) => {
  const result = await calculateCount();
  return res.status(status.OK).json({ status: 'OK', statusCode: status.OK, data: result, type: 'user' });
})


module.exports = {
  userDetails,
  countController,
  deleteUserAccount,
  updateProfile,
  allUsers,
  userRatio,
  Count,
  updatePrivacyController,
  allDeletedAccount,
  userDetailsByID,
  banUserController,
  completeProfileController,
  seeOwnReferalCode,
  myPrivacyController
};