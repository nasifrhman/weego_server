const userEngagementModel = require("./userEngagement.model");

const addUserEngagementService = async (data) => {
    return await userEngagementModel.insertMany(data);
}


module.exports = { addUserEngagementService }