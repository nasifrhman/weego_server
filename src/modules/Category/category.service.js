const Category = require('./category.model')

const addCategoryService = async (data) => {
    return Category.create(data)
}

const allCategoryService = async (filters ,options) => {
    const {page, limit} = options;
    const skip = (page-1)*limit;
    const totalResults = await Category.countDocuments(filters);
    const totalPage = Math.ceil(totalResults/limit);
    const category =await Category.find(filters).skip(skip).limit(limit).sort({createdAt: -1});
    return {category,
        pagination: {
            totalResults,
            totalPage,
            currentPage : page,
            limit
        }
    };
}

const updateCategoryService = async (id, data) => {
    return Category.findByIdAndUpdate(id, data, { new: true })
}

const deleteCategoryService = async (id) => {
    return Category.findByIdAndDelete(id)
}

module.exports = {
    addCategoryService,
    allCategoryService,
    deleteCategoryService,
    updateCategoryService
}