const { default: status } = require("http-status");
const catchAsync = require("../../helpers/catchAsync");
const response = require("../../helpers/response");
const { deleteCategoryService, allCategoryService, addCategoryService, updateCategoryService } = require("./category.service");


const addCategoryController = catchAsync(async (req, res) => {
    if (req.file) req.body.image = `/uploads/category/${req.file.filename}`;
    const result = await addCategoryService(req.body);
    return res.status(status.CREATED).json(response({ status: 'success', statusCode: status.CREATED, type: "Category", message: "Category added", data: result }));
})

const allCategoryController = catchAsync(async (req, res) => {
    const options = {
        page: Number(req.query.page || 1),
        limit: Number(req.query.limit || 10)
    }
    let filters = {};
    const search = req.query.search;
    if (search && search !== 'null' && search !== '' && search !== undefined) {
        const searchRegExp = new RegExp('.*' + search + '.*', 'i');
        filters.$or = [
            { name: { $regex: searchRegExp } }
        ];
    }
    const result = await allCategoryService(filters, options);
    return res.status(status.OK).json(response({ status: 'success', statusCode: status.CREATED, type: "Category", message: "Category all", data: result }));
})

const editCategoryController = catchAsync(async (req, res) => {
    if (req.file) req.body.image = `/uploads/category/${req.file.filename}`;
    const result = await updateCategoryService(req.params.id, req.body);
    return res.status(status.OK).json(response({ status: 'success', statusCode: status.CREATED, type: "Category", message: "Category all", data: result }));
})

const deleteCategoryController = catchAsync(async (req, res) => {
    const result = await deleteCategoryService(req.params.id);
    return res.status(status.OK).json(response({ status: 'success', statusCode: status.CREATED, type: "Category", message: "Category deleted", data: result }));
})


module.exports = {
    addCategoryController,
    allCategoryController,
    editCategoryController,
    deleteCategoryController
}