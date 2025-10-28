const { default: status } = require("http-status");
const ApiError = require("../../helpers/ApiError");
const folderModel = require("./folder.model");
const { default: mongoose } = require("mongoose");


const addFolderService = async (data) => {
    const nameDublicate = await folderModel.findOne({ name: data.name });
    if (nameDublicate) throw new ApiError(status.CONFLICT, 'already added by this name');
    return await folderModel.create(data);
}


const deleteFolderService = async (id) => {
    return await folderModel.findByIdAndDelete(id);
}


const myFolderService = async (userId) => {

    const results = await folderModel.aggregate([
        { $match: { user:new mongoose.Types.ObjectId(String(userId)) } },
        {
            $lookup: {
                from: 'favourites', 
                localField: '_id',
                foreignField: 'folder',
                as: 'favourites'
            }
        },
        {
            $lookup: {
                from: 'services', 
                let: { serviceIds: '$favourites.service' },
                pipeline: [
                    { $match: { $expr: { $in: ['$_id', '$$serviceIds'] } } },
                    {
                        $lookup: {
                            from: 'categories',
                            localField: 'category',
                            foreignField: '_id',
                            as: 'category'
                        }
                    },
                    { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
                    {
                        $project: {
                            serviceName: 1,
                            priceMin: 1,
                            priceMax: 1,
                            rating: 1,
                            image: 1,
                            rating:1,
                            category: { name: 1 }
                        }
                    }
                ],
                as: 'services'
            }
        },

        // Project final output
        {
            $project: {
                folderId: '$_id',
                folderName: '$name',
                services: 1
            }
        }
    ]);

    return results;
};


module.exports = {
/*******  3abf14a3-fcc6-49ce-93f0-5009046c09e3  *******/
    myFolderService,
    addFolderService,
    deleteFolderService
}