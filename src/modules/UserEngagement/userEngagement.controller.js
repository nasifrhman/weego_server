const { status } = require("http-status");
const response = require("../../helpers/response");
const catchAsync = require("../../helpers/catchAsync");
const { addUserEngagementService, engagementHistory, frequentContractors, frequentProviders, frequentEngagements } = require("./userEngagement.service");
const { default: mongoose } = require("mongoose");


const addUserEngagementController = catchAsync(async (req, res) => {
    const result = await addUserEngagementService(req.body);
    return res.status(status.OK).json(response({ status: 'success', statusCode: status.CREATED, type: "UserEngagement", message: "UserEngagement added successfully", data: result, }));
})


const userEngagementHistory = catchAsync(async (req, res) => {
  const role = req.User.currentRole; 
  console.log({ role });
  const options = {
    page: Number(req.query.page || 1),
    limit: Number(req.query.limit || 10),
  };

  const result = await engagementHistory(req.User._id, role, options);

  return res.status(status.OK).json(
    response({
      status: "success",
      statusCode: status.OK,
      type: "UserEngagement",
      message: "UserEngagement data fetched successfully",
      data: result,
    })
  );
});


const frequentUserEngagementController = catchAsync(async (req, res) => {
  const role = req.User.currentRole;

  const result = await frequentEngagements(req.User._id, role);

  const message =
    role === "provider"
      ? "Frequent contractors data fetched successfully"
      : "Frequent providers data fetched successfully";

  return res.status(status.OK).json(
    response({
      status: "success",
      statusCode: status.OK,
      type: "UserEngagement",
      message,
      data: result,
    })
  );
});




module.exports = {  addUserEngagementController, userEngagementHistory ,frequentUserEngagementController };