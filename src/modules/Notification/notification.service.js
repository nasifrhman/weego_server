const notificationModel = require('./notification.model');


const addNotificationService = async (data) => {
    return await notificationModel.create(data);
}

const getNotificationService = async (options, filters) => {
    const { page = 1, limit = 10 } = options;
    const totalResults = await notificationModel.countDocuments(filters);
    const totalPages = Math.ceil(totalResults / limit);
    const notification = await notificationModel.find(filters).skip((page - 1) * limit).limit(limit).populate('targetUser', 'fullName image');
    return { notification, pagination: { totalResults, totalPages, currentPage : page, limit } };
}

const updateNotificationService = async (id, data) => {
    return await notificationModel.findOneAndUpdate({ _id: id }, data, { new: true });
}

module.exports = { addNotificationService, getNotificationService, updateNotificationService }