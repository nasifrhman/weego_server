const jwt = require('jsonwebtoken');

const tokenGenerator = async (user) => {

  const payload = {
    _id: user._id,
    fullName: user.fullName,
    userName: user.userName,
    email: user.email,
    currentRole: user.currentRole,
    planName: user.planName,
    image: user.image, role: user.role,
    isComplete: user.isComplete,
    isLoginToken: user.isLoginToken ? user.isLoginToken : false
  };
  return await jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, {
    expiresIn: '1y',
  });
}

module.exports = { tokenGenerator };