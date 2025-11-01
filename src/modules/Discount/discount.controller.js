const { status } = require("http-status");
const response = require("../../helpers/response");
const catchAsync = require("../../helpers/catchAsync");
const { addDiscountService, editDiscountService, deleteDiscountService, allDiscount, myAllDiscount, getAllDiscountService } = require("./discount.service");


const addDiscount = catchAsync(async (req, res) => {
    // console.log(req.User)
    req.body.provider = req.User._id;
    const newDiscount = await addDiscountService(req.body);
    return res.status(status.OK).json(response({ status: 'success', statusCode: status.CREATED, type: "Discount", message: "Discount added successfully", data: newDiscount, }));
})


const editDiscount = catchAsync(async (req, res) => {
    const newDiscount = await editDiscountService(req.params.id, req.body);
    return res.status(status.CREATED).json(response({ status: 'success', statusCode: status.OK, type: "Discount", message: "Discount edited successfully", data: newDiscount, }));

})

const deleteDiscount = catchAsync(async (req, res) => {
    const newDiscount = await deleteDiscountService(req.params.id);
    return res.status(status.CREATED).json(response({ status: 'success', statusCode: status.OK, type: "Discount", message: "Discount edited successfully", data: newDiscount, }));

})


const myDiscount = catchAsync(async (req, res) => {
    const options = {
        page: Number(req.query.page || 1),
        limit: Number(req.query.limit || 10)
    }
    const Discount = await myAllDiscount(req.User._id, options);
    return res.status(status.OK).json(response({ status: 'success', statusCode: status.OK, type: "Discount", message: "Discount fetched successfully", data: Discount, }));
})



module.exports = { addDiscount, editDiscount, deleteDiscount, myDiscount };