const serviceManagementModel = require("./serviceManagement.model");



const bookingService = async (data) => {
    return await serviceManagementModel.create(data);
}


module.exports = {
    bookingService
}