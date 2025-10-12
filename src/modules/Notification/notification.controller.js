const { default: status } = require("http-status");
const { getNotificationService, updateNotificationService, findNotificationAndUpdate, unreadCountService } = require("./notification.service");
const catchAsync = require("../../helpers/catchAsync");
const response = require("../../helpers/response");
const ApiError = require("../../helpers/ApiError");



const userNotification = catchAsync(async (req, res) => {
    const options = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10
    }
    const filters = { targetUser: req.User._id }
    const notification = await getNotificationService(options, filters);
    return res.status(status.OK).json(response({ status: 'Success', statusCode: status.OK, type: 'notification', message: 'notification-found', data: notification }));
})

const unreadCountAdminNotification = catchAsync(async (req, res) => {
  const count = await unreadCountService({ forAdmin: true, isRead: false });
  return res.status(status.OK).json(
    response({
      status: 'Success',
      statusCode: status.OK,
      type: 'notification',
      message: 'notification-found',
      data: { count }
    })
  );
});



const adminNotification = catchAsync(async (req, res) => {
    const options = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10
    }
    const filters = { forAdmin: true }
    const notification = await getNotificationService(options, filters);
    return res.status(status.OK).json(response({ status: 'Success', statusCode: status.OK, type: 'notification', message: 'notification-found', data: notification }));
})


const businessNotification = catchAsync(async (req, res) => {
    const options = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10
    }
    const filters = {
        $or: [
            { target: 'user-business' },
            {
                $and: [
                    { target: 'business' },
                    { targetUser: req.User._id }
                ]
            }
        ]
    }
    const notification = await getNotificationService(options, filters);
    return res.status(status.OK).json(response({ status: 'Success', statusCode: status.OK, type: 'notification', message: 'notification-found', data: notification }));
})

const readNotification = catchAsync(async (req, res) => {
    const notification = await updateNotificationService(req.params.id, { isRead: true });
    return res.status(status.OK).json(response({ status: 'Success', statusCode: status.OK, type: 'notification', message: 'notification-read', data: notification }));
})

const readAdminEndNotification = catchAsync(async (req, res) => {
    const notification = await findNotificationAndUpdate({ forAdmin: true, isRead: false });
    return res.status(status.OK).json(response({ status: 'Success', statusCode: status.OK, type: 'notification', message: 'notification-read' }));
})


module.exports = {  userNotification,businessNotification,unreadCountAdminNotification,adminNotification, readNotification,readAdminEndNotification }