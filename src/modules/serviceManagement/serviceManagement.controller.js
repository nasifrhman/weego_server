const { default: status } = require("http-status");
const catchAsync = require("../../helpers/catchAsync");
const response = require("../../helpers/response");
const { bookingService } = require("./serviceManagement.service");


const bookingController = catchAsync(async (req, res) => {
    req.body.contructor = req.User._id;
    if(req.files?.image && req.files.image.length > 0){
        req.body.image = req.files.image.map(
            (file) => `/uploads/booking/${file.filename}`
        );
    }
    console.log(req.body)
    const result = await bookingService(req.body)
    return res.status(status.CREATED).json(response({ status: 'Success', statusCode: status.CREATED, type: 'booking', message: 'booking-added', data: result }));
});



module.exports = { bookingController };