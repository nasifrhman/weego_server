
const ApiError = require('../../helpers/ApiError');
const { admiNotificationCount } = require('../../helpers/notificationCount');
const { adminNotificationHandler } = require('../../socket/features/socketNotification');
const { addNotificationService } = require('../Notification/notification.service');
const User = require('../User/user.model');
const bcrypt = require('bcryptjs');
const { default: status } = require('http-status');


const addUser = async (userBody) => {
  await addNotificationService({
    forAdmin: true,
    message: `New user added!`
  });
  let count = await admiNotificationCount();
  await adminNotificationHandler({
    title: `New user added!`,
    // target: 'admin',
    unreadCount: count
  })
  return User.create(userBody);
}

const login = async (email, inputPassword) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new ApiError(status.NOT_FOUND, 'invalid-email');
  if (user && user.isBan === true) throw new ApiError(status.NOT_FOUND, 'blocked');
  const isMatch = await bcrypt.compare(inputPassword, user.password);
  if (!isMatch) throw new ApiError(status.UNAUTHORIZED, 'invalid-password');
  return user;
};



const getUserByEmail = async (email) => {
  console.log({ email })
  return await User.findOne({ email });
}



module.exports = {

  login,
  addUser,
  getUserByEmail,
};
