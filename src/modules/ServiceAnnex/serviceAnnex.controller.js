const { default: status } = require("http-status");
const catchAsync = require("../../helpers/catchAsync");
const response = require("../../helpers/response");
const { newRequestService, requestcontractorEndService, editRequestService } = require("./serviceAnnex.service");
const { default: mongoose } = require("mongoose");


const newRequestController = catchAsync(async (req, res) => {
    req.body.providor = req.User._id;
    const result = await newRequestService(req.body)
    return res.status(status.CREATED).json(response({ status: 'Success', statusCode: status.CREATED, type: 'request', message: 'request-added', data: result }));
});


const requestcontractorEndController = catchAsync(async (req, res) => {
    let filter = {contractor : new mongoose.Types.ObjectId(String(req.User._id))}
    const result = await requestcontractorEndService(filter)
    return res.status(status.CREATED).json(response({ status: 'Success', statusCode: status.CREATED, type: 'request', message: 'request-added', data: result }));
});

const editRequestController = catchAsync(async (req, res) => {
    const result = await editRequestService(req.params.id, req.body)
    return res.status(status.CREATED).json(response({ status: 'Success', statusCode: status.CREATED, type: 'request', message: 'request-fetched', data: result }));
});

module.exports = { newRequestController, requestcontractorEndController, editRequestController };