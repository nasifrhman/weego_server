const { default: status } = require('http-status');
const ApiError = require('../../helpers/ApiError');
const User = require('./user.model');
const { default: mongoose } = require('mongoose');
const mysubscriptionModel = require('../MySubscription/mysubscription.model');



const getUserById = async (id) => {
  return await User.findById(id).select('-password');
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
        points: 1,
        goal: 1,
        skillLevel: 1,
        ageGroup: 1,
        userType: 1,
        yourRefaralCode: 1
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



const deleteAccountService = async (id) => {
  return await User.findByIdAndDelete(id)
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



const updateUserById = async (id, data) => {
  if (data.sports) data.currentTrainning = data.sports;
  return await User.findByIdAndUpdate(id, data, { new: true });
}


const changeCurrentTrainningService = async (id, currentTrainning) => {
  const user = await getUserById(id);
  console.log({user})
  if(user.planName === '' || !user.planName){
    throw new ApiError(status.BAD_REQUEST, "please subscribe to a plan to change your current trainning")
  }
  else if (user.planName === 'Sport Pro') {
    const sportLength = user.sports.length;
    if (user.sports.includes(currentTrainning)){
      user.currentTrainning = currentTrainning;
      user.save()
      return user;
    }
    if (sportLength > 2) throw new ApiError(status.BAD_REQUEST, "your reached your limit. please switch in Elite for more")
  }
  if (!user.sports.includes(currentTrainning)) {
    user.sports.push(currentTrainning);
    user.currentTrainning = currentTrainning;
    user.save()
  }
  return user;
}



const getUsers = async (filter, options) => {
  const users = await User.aggregate([
    { $match: filter },
    {
      $project: {
        fullName: 1,
        email: 1,
        image: 1,
        planName: 1,
        userType: 1,
        planName: 1,
        userType: 1,
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
  getMonthlyUserRatio,
  getUserByfilter,
  calculateCountUserService,
  changeCurrentTrainningService,
  getCurrentTrainning,
  calculateSubscriptionCount
}
