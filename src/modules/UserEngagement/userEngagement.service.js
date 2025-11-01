const { default: mongoose } = require("mongoose");
const UserEngagement = require("./userEngagement.model");

const addUserEngagementService = async (data) => {
    return await UserEngagement.create(data);
}


const engagementHistory = async (userId, role, options = {}) => {
    console.log({ role });
  const { page = 1, limit = 10 } = options;
  const skip = (page - 1) * limit;

  // Determine filter and the field to populate
  let filter = {};
  let populateField = "";
  let populateAs = "";

  if (role === "contractor") {
    filter.contractor = new mongoose.Types.ObjectId(String(userId));
    populateField = "provider";
    populateAs = "counterpartInfo";
  } else if (role === "provider") {
    filter.provider = new mongoose.Types.ObjectId(String(userId));
    populateField = "contractor";
    populateAs = "counterpartInfo";
  } else {
    throw new Error("Invalid role");
  }

  const [history, totalResults] = await Promise.all([
    UserEngagement.aggregate([
      { $match: filter },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: populateField,
          foreignField: "_id",
          as: populateAs,
        },
      },
      { $unwind: { path: `$${populateAs}`, preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "services",
          localField: "service",
          foreignField: "_id",
          as: "serviceInfo",
        },
      },
      { $unwind: { path: "$serviceInfo", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          counterpartName: `$${populateAs}.fullName`,
          counterpartId: `$${populateAs}._id`,
          counterpartImage: `$${populateAs}.image`,
          serviceName: "$serviceInfo.serviceName",
          serviceId: "$serviceInfo._id",
          price: 1,
          date: "$createdAt",
        },
      },
    ]),
    UserEngagement.countDocuments(filter),
  ]);

  return {
    history,
    pagination: {
      totalResults,
      limit,
      totalPages: Math.ceil(totalResults / limit),
      currentPage: page,
    },
  };
};



const frequentProviders = async (filter) => {
    return await UserEngagement.aggregate([
        { $match: filter },
        {
            $group: {
                _id: { provider: "$provider", service: "$service" },
                totalEngagements: { $sum: 1 },
            },
        },
        { $sort: { totalEngagements: -1 } },
        { $limit: 10 },
        {
            $lookup: {
                from: "users",
                localField: "_id.provider",
                foreignField: "_id",
                as: "providerInfo",
            },
        },
        { $unwind: "$providerInfo" },
        {
            $project: {
                _id: 0,
                providerName: "$providerInfo.fullName",
                providerId: "$providerInfo._id",
                providerImage: "$providerInfo.image",
                serviceId: "$_id.service",
                totalEngagements: 1,
            },
        },
    ]);
}



const frequentEngagements = async (userId, role) => {
  let filter = {};
  let groupField = "";
  console.log({ role, userId });

  if (role === "provider") {
    console.log("Fetching frequent contractors for provider:", userId);
    // Show frequent contractors for this provider
    filter.provider = new mongoose.Types.ObjectId(String(userId));
    groupField = "$contractor";
  } else if (role === "contractor") {
    // Show frequent providers for this contractor
    filter.contractor = new mongoose.Types.ObjectId(String(userId));
    groupField = "$provider";
  } else {
    throw new Error("Invalid role");
  }

  return await UserEngagement.aggregate([
    { $match: filter },
    {
      $group: {
        _id: { user: groupField, service: "$service" },
        totalEngagements: { $sum: 1 },
      },
    },
    { $sort: { totalEngagements: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "users",
        localField: "_id.user",
        foreignField: "_id",
        as: "counterpartInfo",
      },
    },
    { $unwind: "$counterpartInfo" },
    {
      $lookup: {
        from: "services",
        localField: "_id.service",
        foreignField: "_id",
        as: "serviceInfo",
      },
    },
    { $unwind: "$serviceInfo" },
    {
      $project: {
        _id: 0,
        counterpartName: "$counterpartInfo.fullName",
        counterpartImage: "$counterpartInfo.image",
        serviceId: "$_id.service",
        totalEngagements: 1,
      },
    },
  ]);
};



module.exports = { addUserEngagementService, frequentEngagements, frequentProviders, engagementHistory }