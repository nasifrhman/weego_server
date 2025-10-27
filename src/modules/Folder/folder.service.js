const { default: status } = require("http-status");
const ApiError = require("../../helpers/ApiError");
const folderModel = require("./folder.model");


const addFolderService = async (data) => {
    const nameDublicate = await folderModel.findOne({name : data.name});
    if(nameDublicate) throw new ApiError(status.CONFLICT, 'already added by this name');
    return await folderModel.create(data);
}


const deleteFolderService = async (id) => {
    return await folderModel.findByIdAndDelete(id);
}


const myFolderService = async (filter) => {
    return await folderModel.aggregate([
        { $match: filter },
        { $sort: { createdAt: -1 } }
    ]);
};



module.exports = {
    myFolderService,
    addFolderService,
    deleteFolderService
}