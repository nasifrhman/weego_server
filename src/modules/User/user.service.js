const User = require('./user.model');
const { default: mongoose } = require('mongoose');
const mysubscriptionModel = require('../MySubscription/mysubscription.model');
const deleteAccountModel = require('../DeleteAccount/deleteAccount.model');
const ApiError = require('../../helpers/ApiError');



const getUserById = async (id) => {
  return await User.findById(id);
}

const getUserfieldById = async (id) => {
  return await User.findById(id).select('fullName image workoutCount');
}

const getreferralCode = async (id) => {
  return await User.findById(id).select('referralCode -_id');
}

const getUserProfile = async (id) => {
  const result = await User.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(String(id)) }
    },
    {
      $project: {
        _id: 1,
        fullName: 1,
        phoneNumber: 1,
        email: 1,
        image: 1,
        bio: 1,
        contact1: 1,
        contact2: 1,
        dob: 1,
        role: 1,
        gender: 1,
        language: 1,
      }
    }
  ]);
  return result[0] || null;
}

const getUserByEmail = async (email) => {
  return await User.findOne({ email });
}


const getUserByfilter = async (filter) => {
  return await User.findOne(filter);
}

const getCurrentTrainning = async (id) => {
  const result = await User.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(String(id)) } },
    {
      $lookup: {
        from: "categories",
        localField: "currentTrainning",
        foreignField: "_id",
        as: "currentTrainningDetails"
      }
    },
    { $unwind: "$currentTrainningDetails" },
    {
      $project: {
        _id: 0,
        currentTrainning: "$currentTrainningDetails.name"
      }
    }
  ]);
  return result[0] || null;
};



const deleteAccountService = async (data) => {
  const user = await User.findOneAndUpdate(
    { _id: data.user },
    { $pull: { role: data.currentRole } },
    { new: true }
  );
  if (user) {
    if (user.role.length > 0 && user.currentRole === data.currentRole) {
      user.currentRole = user.role[0];
      await user.save();
    } else if (user.role.length === 0) {
      user.email = `${user.email}_deleted_${Date.now()}`;
      // user.userName = `${user.userName}_deleted_${Date.now()}`;
      user.isDeleted = true;
      user.isBan = true;
      await user.save();
    }

    user && await deleteAccountModel.create({
      user: data.user,
      youliveIn: data.youLiveIn || '',
      reason: data.deleteReason || ''
    });
    return user;
  }
}


const calculateCountUserService = async () => {
  return await User.countDocuments();
};


const calculateSubscriptionCount = async () => {
  const subscriptionUsage = await mysubscriptionModel.aggregate([
    {
      $group: {
        _id: "$subscription",
        userCount: { $sum: 1 },
      }
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "_id",
        as: "subscriptionDetails"
      }
    },
    {
      $unwind: "$subscriptionDetails"
    },
    {
      $project: {
        _id: 0,
        // subscriptionId: "$subscriptionDetails._id",
        planName: "$subscriptionDetails.planName",
        userCount: 1
      }
    }
  ]);

  return subscriptionUsage;
};


const banUserService = async (id, data) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error('User not found');
  }
  Object.assign(user, data);
  const updatedUser = await user.save();
  return updatedUser;
}


const unbanUserService = async (id, data) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error('User not found');
  }
  Object.assign(user, data);
  const updatedUser = await user.save();
  return updatedUser;
}



// const updateUserById = async (id, data) => {
//   const user = await User.findById(id);
//   if (!user) throw new ApiError(404, 'User not found');
//   if (data.language) {
//     // if (!Array.isArray(data.language)) {
//     //   data.language = [data.language];
//     // }
//     if (!user.language.includes(data.language)) {
//       user.language.push(data.language);
//     }
//   }
//   // Remove language from data so findByIdAndUpdate doesn't overwrite it
//   const { language, ...otherData } = data;
//   Object.assign(user, otherData);
//   await user.save();
//   return user;
// };



const updateUserById = async (id, data) => {
  return await User.findByIdAndUpdate(id, data, {new: true});
};




const getUsers = async (filter, options) => {
  const users = await User.aggregate([
    { $match: filter },
    {
      $project: {
        fullName: 1,
        email: 1,
        image: 1,
        createdAt: 1,
        isBan: 1,
      }
    },
    { $sort: { createdAt: -1 } },
    { $skip: (options.page - 1) * options.limit },
    { $limit: options.limit },
  ]);

  const totalResults = await User.countDocuments(filter);
  const totalPages = Math.ceil(totalResults / options.limit);
  const pagination = { totalResults, totalPages, currentPage: options.page, limit: options.limit };

  return { users, pagination };
};


const getDeletedUsers = async (filter, options) => {
  const users = await User.aggregate([
    { $match: filter },
    {
      $project: {
        fullName: 1,
        email: 1,
        image: 1,
        updatedAt: 1,
        isBan: 1,
      }
    },
    { $sort: { createdAt: -1 } },
    { $skip: (options.page - 1) * options.limit },
    { $limit: options.limit },
  ]);

  const totalResults = await User.countDocuments(filter);
  const totalPages = Math.ceil(totalResults / options.limit);
  const pagination = { totalResults, totalPages, currentPage: options.page, limit: options.limit };

  return { users, pagination };
};




const getMonthlyUserRatio = async (year) => {
  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year}-12-31T23:59:59`);

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const result = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: { month: { $month: "$createdAt" } },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { "_id.month": 1 }
    }
  ]);

  // Format result for all 12 months, default to 0 if no users
  const formattedResult = months.map((month, index) => {
    const monthData = result.find(r => r._id.month === index + 1);
    return {
      month,
      user: monthData ? monthData.count : 0
    };
  });

  return formattedResult;
};



module.exports = {
  getUserById,
  getUserfieldById,
  banUserService,
  unbanUserService,
  getreferralCode,
  getUserProfile,
  updateUserById,
  getUserByEmail,
  deleteAccountService,
  getUsers,
  getDeletedUsers,
  getMonthlyUserRatio,
  getUserByfilter,
  calculateCountUserService,
  getCurrentTrainning,
  calculateSubscriptionCount
}
