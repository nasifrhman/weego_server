const { status } = require("http-status");
const response = require("../../helpers/response");
const catchAsync = require("../../helpers/catchAsync");
const { addUserEngagementService } = require("./userEngagement.service");


const addUserEngagementController = catchAsync(async (req, res) => {
    const result = await addUserEngagementService(req.body);
    return res.status(status.OK).json(response({ status: 'success', statusCode: status.CREATED, type: "UserEngagement", message: "UserEngagement added successfully", data: result, }));
})



// const myAllUserEngagementController = catchAsync(async (req, res) => {
//     const options = {
//         page: Number(req.query.page || 1),
//         limit : Number(req.query.limit || 10)
//     }
//     const FQ = await myAllUserEngagement(req.User._id, options);
//     return res.status(status.OK).json(response({ status: 'success', statusCode: status.OK, type: "UserEngagement", message: "UserEngagement fetched successfully", data: FQ, }));
// })


module.exports = {  addUserEngagementController}