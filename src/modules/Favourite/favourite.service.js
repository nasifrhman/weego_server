const favouriteModel = require("./favourite.model");


const myFavouriteService = async (filter, options) => {
    const { page, limit } = options;
    console.log({ page, limit })
    const skip = (page - 1) * limit;

    const [myfavourite, totalResults] = await Promise.all([
        favouriteModel.aggregate([
            { $match: filter },
            { $sort: { createdAt: -1} }, 
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: "services",
                    localField: "service",
                    foreignField: "_id",
                    as: "serviceData",
                },
            },
            { $unwind: { path: "$serviceData", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    title: "$serviceData.title",
                    image: "$serviceData.image",
                    price: "$serviceData.price",
                    description: "$serviceData.description",
                },
            }
        ]),
        favouriteModel.countDocuments(filter),
    ]);

    return {
        myfavourite,
        pagination: {
            totalResults,
            totalPages: Math.ceil(totalResults / limit),
            currentPage: page,
            limit,
        },
    };
};


const addFavouriteService = async (data) => {
    return await favouriteModel.create(data);
}

const unFavouriteService = async (data) => {
    return await favouriteModel.deleteOne(data)
}

module.exports = {
    myFavouriteService,
    addFavouriteService,
    unFavouriteService
}