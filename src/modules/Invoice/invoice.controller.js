const { status } = require("http-status");
const response = require("../../helpers/response");
const catchAsync = require("../../helpers/catchAsync");
const { addInvoiceService, editInvoiceService, deleteInvoiceService, myAllInvoice } = require("./invoice.service");


const addInvoiceController = catchAsync(async (req, res) => {
    req.body.user = req.User._id;
    const newFQ = await addInvoiceService(req.body);
    return res.status(status.OK).json(response({ status: 'success', statusCode: status.CREATED, type: "Invoice", message: "Invoice added successfully", data: newFQ, }));
})


const editInvoiceController = catchAsync(async (req, res) => {
    const newFQ = await editInvoiceService(req.params.id, req.body);
    return res.status(status.CREATED).json(response({ status: 'success', statusCode: status.OK, type: "Invoice", message: "Invoice edited successfully", data: newFQ, }));

})


const deleteInvoiceController = catchAsync(async (req, res) => {
    const newFQ = await deleteInvoiceService(req.params.id);
    return res.status(status.CREATED).json(response({ status: 'success', statusCode: status.OK, type: "Invoice", message: "Invoice edited successfully", data: newFQ, }));

})


const myAllInvoiceController = catchAsync(async (req, res) => {
    const options = {
        page: Number(req.query.page || 1),
        limit : Number(req.query.limit || 10)
    }
    const FQ = await myAllInvoice(req.User._id, options);
    return res.status(status.OK).json(response({ status: 'success', statusCode: status.OK, type: "Invoice", message: "Invoice fetched successfully", data: FQ, }));
})


module.exports = { addInvoiceController, editInvoiceController, deleteInvoiceController, myAllInvoiceController }