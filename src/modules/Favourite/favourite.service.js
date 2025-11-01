const favouriteModel = require("./favourite.model");

const addFavouriteService = async (data) => {
    return await favouriteModel.create(data);
}


const unFavouriteService = async (data) => {
    return await favouriteModel.deleteOne(data)
}


const allSavedService = async (filter, options) => {
    const { page, limit } = options;
    const skip = (page - 1) * limit;
    const [result, totalResults] = await Promise.all([
        favouriteModel.aggregate([
            { $match: filter },
            {
                $skip: skip
            },
            {
                $limit: limit
            },
            {
                $lookup: {
                    from: 'services',
                    localField: 'service',
                    foreignField: '_id',
                    as: 'serviceDetails'
                }
            },
            { $unwind: '$serviceDetails' },
            {
                $project: {
                    _id: 0,
                    serviceName: '$serviceDetails.serviceName',
                    serviceId: '$serviceDetails._id',
                    serviceImage: { $arrayElemAt: ['$serviceDetails.image', 0] },
                    price: '$serviceDetails.price',
                    rating: '$serviceDetails.rating'
                }
            }
        ]),
        favouriteModel.countDocuments(filter)
    ]);
    return {
        results: result,
        pagination: {
            totalResults,
            currentPage: page,
            totalPages: Math.ceil(totalResults / limit)
        }
    }
}

module.exports = {
    addFavouriteService,
    unFavouriteService,
    allSavedService
}