const catchAsync = require("../../helpers/catchAsync");
const response = require("../../helpers/response");
const { default: status } = require("http-status");
const { getAllReportService, addReportService } = require("./report.service");


const addReportController = catchAsync(async (req, res) => {
    req.body.reporter = req.User._id;
    if (req.files && req.files.image && req.files.image.length > 0) {
        req.body.image = req.files.image.map(
            (file) => `/uploads/report/${file.filename}`
        );
    }
    const report = await addReportService(req.body);
    return res.status(status.CREATED).json(response({ status: "success", statusCode: status.CREATED, type: "report", message: req.t("report-added"), data: report }));
});



const getReportController = catchAsync(async (req, res) => {
    const options = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10
    };

    const report = await getAllReportService(options);
    return res.status(status.OK).json(
        response({
            status: "success",
            statusCode: status.OK,
            type: "report",
            message: "report fetched successfully",
            data: report
        })
    );
});



module.exports = { addReportController, getReportController };