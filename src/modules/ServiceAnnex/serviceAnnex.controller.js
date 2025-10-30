const { default: status } = require("http-status");
const catchAsync = require("../../helpers/catchAsync");
const response = require("../../helpers/response");
const { newRequestService, requestContructorEndService, editRequestService } = require("./serviceAnnex.service");
const { default: mongoose } = require("mongoose");


const newRequestController = catchAsync(async (req, res) => {
    req.body.providor = req.User._id;
    const result = await newRequestService(req.body)
    return res.status(status.CREATED).json(response({ status: 'Success', statusCode: status.CREATED, type: 'request', message: 'request-added', data: result }));
});


const requestContructorEndController = catchAsync(async (req, res) => {
    let filter = {contructor : new mongoose.Types.ObjectId(String(req.User._id))}
    const result = await requestContructorEndService(filter)
    return res.status(status.CREATED).json(response({ status: 'Success', statusCode: status.CREATED, type: 'request', message: 'request-added', data: result }));
});

const editRequestController = catchAsync(async (req, res) => {
    const result = await editRequestService(req.params.id, req.body)
    return res.status(status.CREATED).json(response({ status: 'Success', statusCode: status.CREATED, type: 'request', message: 'request-fetched', data: result }));
});

module.exports = { newRequestController, requestContructorEndController, editRequestController };