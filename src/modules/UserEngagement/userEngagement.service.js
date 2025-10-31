const UserEngagement = require("./userEngagement.model");

const addUserEngagementService = async (data) => {
    return await UserEngagement.insertMany(data);
}


const engagementHistory = async (filter, options = {}) => {
  const { page = 1, limit = 10 } = options;
  const skip = (page - 1) * limit;

  const [providerHistory, totalResults] = await Promise.all([
    UserEngagement.aggregate([
      { $match: filter },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "provider",
          foreignField: "_id",
          as: "providerInfo",
        },
      },
      { $unwind: { path: "$providerInfo", preserveNullAndEmptyArrays: true } },
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
          providerName: "$providerInfo.fullName",
          providerId: "$providerInfo._id",
          providerImage: "$providerInfo.image",
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
    providerHistory,
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



const frequentContractors = async (filter) => {
    return await UserEngagement.aggregate([
        { $match: filter },
        {
            $group: {
                _id: { contractor: "$contractor", service: "$service" },
                totalEngagements: { $sum: 1 },
            },
        },
        { $sort: { totalEngagements: -1 } },
        { $limit: 10 },
        {
            $lookup: {
                from: "users",
                localField: "_id.contractor",
                foreignField: "_id",
                as: "contractorInfo",
            },
        },
        { $unwind: "$contractorInfo" },
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
                contractorName: "$contractorInfo.fullName",
                contractorImage: "$contractorInfo.image",
                serviceId: "$_id.service",
                totalEngagements: 1,
            },
        },
    ]);
};



// const getContractorProviderData = async (contractorId) => {


//     // === 1. Provider History ===
//     const providerHistory = await UserEngagement.aggregate([
//         { $match: { contractor: new mongoose.Types.ObjectId(String(contractorId)) } },
//         {
//             $lookup: {
//                 from: "users",
//                 localField: "provider",
//                 foreignField: "_id",
//                 as: "providerInfo",
//             },
//         },
//         { $unwind: "$providerInfo" },
//         {
//             $lookup: {
//                 from: "services",
//                 localField: "service",
//                 foreignField: "_id",
//                 as: "serviceInfo",
//             },
//         },
//         { $unwind: "$serviceInfo" },
//         {
//             $project: {
//                 _id: 0,
//                 providerName: "$providerInfo.fullName",
//                 providerImage: "$providerInfo.image",
//                 serviceName: "$serviceInfo.serviceName",
//                 price: 1,
//                 date: "$createdAt",
//             },
//         },
//         { $sort: { date: -1 } },
//     ]);

//     // === 2. Frequent Providers ===
//     const frequentProviders = await userEngagementModel.aggregate([
//         { $match: { contractor: new mongoose.Types.ObjectId(String(contractorId)) } },
//         {
//             $group: {
//                 _id: { provider: "$provider", service: "$service" },
//                 totalEngagements: { $sum: 1 },
//             },
//         },
//         { $sort: { totalEngagements: -1 } },
//         { $limit: 5 },
//         {
//             $lookup: {
//                 from: "users",
//                 localField: "_id.provider",
//                 foreignField: "_id",
//                 as: "providerInfo",
//             },
//         },
//         { $unwind: "$providerInfo" },
//         {
//             $project: {
//                 _id: 0,
//                 providerName: "$providerInfo.fullName",
//                 providerImage: "$providerInfo.image",
//                 serviceId: "$_id.service",
//             },
//         },
//     ]);

//     return { providerHistory, frequentProviders };
// };



module.exports = { addUserEngagementService, frequentContractors, frequentProviders, engagementHistory }