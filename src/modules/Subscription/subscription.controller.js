const { default: status } = require("http-status");
const catchAsync = require('../../helpers/catchAsync');
const response = require('../../helpers/response');
const { updateSubscriptionPlan, getAllPlans, deleteSubscriptionPlan, addSubscriptionPlan } = require("./subscription.service");

const addPlan = catchAsync(async (req, res) => {
    const plan = await addSubscriptionPlan(req.body);
    return res.status(status.OK).json(response({ status: 'Success', statusCode: status.OK, type: 'subscription', message: 'plan-added', data: plan }));
})


const editPlan = catchAsync(async (req, res) => {
    const plan = await updateSubscriptionPlan(req.params.id, req.body);
    return res.status(status.OK).json(response({ status: 'Success', statusCode: status.OK, type: 'subscription', message: 'plan-updated', data: plan }));
})


const allPlans = catchAsync(async (req, res) => {
    const plans = await getAllPlans();
    return res.status(status.OK).json(response({ status: 'Success', statusCode: status.OK, type: 'subscription', message: 'plans', data: plans }));
})

const deletePlan = catchAsync(async (req, res) => {
    const deletedPlan = await deleteSubscriptionPlan(req.params.id);
    return res.status(status.OK).json(response({ status: 'Success', statusCode: status.OK, type: 'subscription', message: 'plan-deleted', data: deletedPlan }));
});


module.exports = { addPlan,editPlan, allPlans ,deletePlan};