const { default: status } = require("http-status");
const catchAsync = require("../../helpers/catchAsync");
const { addAdminService, allAdminService } = require("./admin.service");
const response = require("../../helpers/response");

const addAdminController = catchAsync(async(req , res) => {
    const result = await addAdminService(req.body);
    return res.status(status.CREATED).json(response({status: 'success', statusCode: status.CREATED, message: req.t('employee_added'), type: 'admin', data: result}))
})


const allAdminController = catchAsync(async(req , res) => {
    const options = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10
    }
    const result = await allAdminService(options);
    return res.status(status.CREATED).json(response({status: 'success', statusCode: status.CREATED, message: req.t('all_employees'), type: 'admin', data: result}))
})


const anAdminDetailsController = catchAsync(async(req , res) => {
    const result = await anAdminDetailsService(req,body);
    return res.status(status.CREATED).json(response({status: 'success', statusCode: status.CREATED, message: req.t('details'), type: 'admin', data: result}))
})


module.exports = {
    addAdminController,
    allAdminController,
    anAdminDetailsController
}