
const ApiError = require('../../helpers/ApiError');
const { admiNotificationCount } = require('../../helpers/notificationCount');
const { adminNotificationHandler, EmiteNotificationHandler } = require('../../socket/features/socketNotification');
const { addNotificationService } = require('../Notification/notification.service');
const User = require('../User/user.model');
const bcrypt = require('bcryptjs');
const { default: status } = require('http-status');
const privacyModel = require('../Privacy/privacy.model');


const addUser = async (userBody) => {
  const existingUser = await getUserByEmail(userBody.email);
  if (existingUser && !existingUser.role.includes(userBody.role) && !existingUser.role.includes(null) && !existingUser.role.includes('null')) {
    existingUser.role.push(userBody.role);
    const roleTranslations = {
      admin: { en: "Admin", de: "Administrator" },
      contractor: { en: "contractor", de: "contractor" },
      provider: { en: "provider", de: "provider" }
    };
    const translatedRole = roleTranslations[userBody.role];
    await addNotificationService({
      title: {
        en: `Congratulations! You have been assigned the role of ${translatedRole.en}.`,
        es: `Glückwunsch! Sie wurden der Rolle ${translatedRole.de} zugewiesen.`
      },
      message: {
        en: `Congratulations! You have been assigned the role of ${translatedRole.en}.`,
        es: `Glückwunsch! Sie wurden der Rolle ${translatedRole.de} zugewiesen.`
      },
      targetUser: existingUser._id,
      target: 'user'
    });


    await EmiteNotificationHandler({
      title: `You've been assigned a new role: ${userBody.role}`,
      image: existingUser.image,
      message: `Congratulations! You have been assigned the role of ${userBody.role}.`,
      target: 'user',
    });
    return await existingUser.save();
  } else {
    const user = new User(userBody);
    user.userName = userBody.fullName.split("*")[0];
    user.currentRole = userBody.role;
    const roleTranslations = {
      admin: { en: "Admin", de: "Administrator" },
      contractor: { en: "contractor", de: "contractor" },
      provider: { en: "provider", de: "provider" }
    };

    const translatedRole = roleTranslations[userBody.role] || {
      en: userBody.role,
      es: userBody.role,
    };

    !userBody.role === "admin" && await addNotificationService({
      title: {
        en: `A new ${translatedRole.en} joined`,
        es: `Ein neuer ${translatedRole.de} ist beigetreten`
      },
      message: {
        en: `A new ${translatedRole.en} joined`,
        es: `Ein neuer ${translatedRole.de} ist beigetreten`
      },
      targetUser: user._id,
      target: 'admin'
    });


    !userBody.role === "admin" && await adminNotificationHandler({
      title: `A new ${userBody.role} Joined`,
      image: user.image,
      message: `A new ${userBody.role} Joined`,
      target: 'admin',
    })
    await privacyModel.create({ user: user._id });
    return await user.save();
  }
}



const login = async (role , email, inputPassword) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new ApiError(status.NOT_FOUND, 'invalid-email');
  if (user && user.isBan === true) throw new ApiError(status.NOT_FOUND, 'blocked');
  const isMatch = await bcrypt.compare(inputPassword, user.password);
  if (!user.role?.includes(role)) {
    throw new ApiError(status.UNAUTHORIZED, 'invalid-role');
  }
  if (!isMatch) throw new ApiError(status.UNAUTHORIZED, 'invalid-password');
  return user;
};



const getUserByEmail = async (email) => {
  return await User.findOne({ email });
}



module.exports = {

  login,
  addUser,
  getUserByEmail,
};
