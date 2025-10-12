const { default: status } = require("http-status");
const subscriptionModel = require("./subscription.model");
const ApiError = require('../../helpers/ApiError');

const addSubscriptionPlan = async (data) => {
    const subscription = await subscriptionModel.findOne({ planName: data.planName });
    if (subscription) throw new ApiError(status.CONFLICT, 'name conflict');
    else return await subscriptionModel.create(data);
};

const updateSubscriptionPlan = async (id, data) => {
    return await subscriptionModel.findByIdAndUpdate(id, data, {new: data})
};

const getAllPlans = async () => {
    return await subscriptionModel.find();
}

const subscriptionByFilter = async (data) => {
    return await subscriptionModel.findOne(data);
}



const subscriptionByID = async (id) => {
    return await subscriptionModel.findById(id);
}

const deleteSubscriptionPlan = async (id) => {
    return await subscriptionModel.findByIdAndDelete(id);
}


module.exports = { addSubscriptionPlan, updateSubscriptionPlan, getAllPlans, subscriptionByID, deleteSubscriptionPlan,subscriptionByFilter };
