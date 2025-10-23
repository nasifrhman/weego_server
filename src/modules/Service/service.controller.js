const response = require("../../helpers/response");
const catchAsync = require('../../helpers/catchAsync');
const { status } = require("http-status");
const { addServiceService, updateServiceService, deleteServiceService, serviceDetailsService, allServiceService } = require("./service.service");



const addServiceController = catchAsync(async (req, res) => {
    req.body.user = req.User._id;
    if (req.file) req.body.image = `/uploads/service/${req.file.filename}`;
    const result = await addServiceService(req.body);
    return res.status(status.CREATED).json(response({ status: 'Success', statusCode: status.CREATED, type: 'Service', message: 'Service-added', data: result }));
})


const editServiceController = catchAsync(async (req, res) => {
    if (req.file) req.body.image = `/uploads/service/${req.file.filename}`
    const result = await updateServiceService(req.params.id, req.body);
    return res.status(status.OK).json(response({ status: 'Success', statusCode: status.OK, type: 'Service', message: 'Service edited', data: result }));
})

const deleteServiceController = catchAsync(async (req, res) => {
    const result = await deleteServiceService(req.params.id);
    return res.status(status.OK).json(response({ status: 'Success', statusCode: status.OK, type: 'Service', message: 'Service deleted', data: result }));
})

const aServiceDetails = catchAsync(async (req, res) => {
    const result = await serviceDetailsService(req.params.id);
    return res.status(status.OK).json(response({ status: 'Success', statusCode: status.OK, type: 'Service', message: 'Service details', data: result }));
})


const getAllServiceUserEndController = catchAsync(async (req, res) => {
    const options = {
        page: Number(req.query.page || 1),
        limit: Number(req.query.limit || 10)
    }
    const result = await this.getAllService(req.User._id, options);
    return res.status(status.OK).json(response({ status: 'Success', statusCode: status.OK, type: 'Service', message: 'Service fetched', data: result }));
})


const getAllServiceController = catchAsync(async(req, res) => {
    const options = {
        page: Number(req.query.page || 1),
        limit: Number(req.query.limit || 10)
    }   
    const result = await allServiceService(options);
    return res.status(status.OK).json(response({ status: 'Success', statusCode: status.OK, type: 'Service', message: 'Service fetched', data: result }));
})




module.exports = { getAllServiceController , addServiceController, editServiceController, deleteServiceController, aServiceDetails, getAllServiceUserEndController }