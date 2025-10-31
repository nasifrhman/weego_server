const { status } = require("http-status");
const response = require("../../helpers/response");
const catchAsync = require("../../helpers/catchAsync");
const { addUserEngagementService, getContractorProviderData, engagementHistory, frequentUser, frequentContractors, frequentProviders } = require("./userEngagement.service");
const { default: mongoose } = require("mongoose");


const addUserEngagementController = catchAsync(async (req, res) => {
    const result = await addUserEngagementService(req.body);
    return res.status(status.OK).json(response({ status: 'success', statusCode: status.CREATED, type: "UserEngagement", message: "UserEngagement added successfully", data: result, }));
})


const contractorEndHistory = catchAsync(async (req, res) => {
    const result = await engagementHistory({ contractor: new mongoose.Types.ObjectId(String(req.User._id)) });
    return res.status(status.OK).json(response({ status: 'success', statusCode: status.OK, type: "UserEngagement", message: "UserEngagement data fetched successfully", data: result, }));
})



const providerEndHistory = catchAsync(async (req, res) => {
    const result = await engagementHistory({ provider: new mongoose.Types.ObjectId(String(req.User._id)) });
    return res.status(status.OK).json(response({ status: 'success', statusCode: status.OK, type: "UserEngagement", message: "UserEngagement data fetched successfully", data: result, }));
})


const frequentUserContractorEndController = catchAsync(async (req, res) => {
  const result = await frequentContractors({
    provider: new mongoose.Types.ObjectId(String(req.User._id)), 
  });

  return res.status(status.OK).json(
    response({
      status: 'success',
      statusCode: status.OK,
      type: "UserEngagement",
      message: "Frequent contractors data fetched successfully",
      data: result,
    })
  );
});



const frequentUserProviderEndController = catchAsync(async (req, res) => {
    const result = await frequentProviders({ provider: new mongoose.Types.ObjectId(String(req.User._id)) });
    return res.status(status.OK).json(response({ status: 'success', statusCode: status.OK, type: "UserEngagement", message: "frequent providers data fetched successfully", data: result, }));
})



// const myAllUserEngagementController = catchAsync(async (req, res) => {
//     const options = {
//         page: Number(req.query.page || 1),
//         limit : Number(req.query.limit || 10)
//     }
//     const FQ = await myAllUserEngagement(req.User._id, options);
//     return res.status(status.OK).json(response({ status: 'success', statusCode: status.OK, type: "UserEngagement", message: "UserEngagement fetched successfully", data: FQ, }));
// })


module.exports = {  addUserEngagementController, contractorEndHistory , providerEndHistory,frequentUserContractorEndController, frequentUserProviderEndController };