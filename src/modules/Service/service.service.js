const { default: status } = require('http-status');
const serviceModel = require('./service.model');
const { default: mongoose } = require('mongoose');
const ApiError = require('../../helpers/ApiError');


const addServiceService = async (data) => {
    const service = await serviceModel.findOne({ serviceName: data.serviceName })
    if (service) throw new ApiError(status.CONFLICT, 'already added by this name')
    return await serviceModel.create(data);
}

const deleteServiceService = async (id) => {
    return await serviceModel.findByIdAndDelete(id);
}

const serviceDetailsService = async (id) => {
    return await serviceModel.findById(id);
}


const updateServiceService = async (id, data) => {
    return await serviceModel.findByIdAndUpdate(id, data, { new: true })
}

const getServiceService = async (filters, options) => {
    const { page, limit } = options;
    const skip = (page - 1) * limit;
    const totalResults = await serviceModel.countDocuments(filters);
    const totalPages = Math.ceil(totalResults / limit);
    const service = await serviceModel.find(filters).sort({ createdAt: -1 }).skip(skip).limit(limit)
    return {
        service, pagination: {
            totalResults,
            totalPages,
            currentPage: page,
            limit
        }
    };
}






const getAllService = async (userId, options) => {
    const { page, limit } = options;
    const skip = (page - 1) * limit;
    const [service, totalResults] = await Promise.all([
        serviceModel.aggregate([
            { $skip: skip },
            { $limit: limit },
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                    from: 'favourites',
                    let: { serviceId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$service', '$$serviceId'] },
                                        { $eq: ['$user', new mongoose.Types.ObjectId((String(userId)))] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'favourites'
                }
            },
            {
                $addFields: {
                    isFavourited: { $gt: [{ $size: '$favourites' }, 0] }
                }
            },
            {
                $project: {
                    title: 1,
                    price: 1,
                    image: 1,
                    isFavourited: 1,
                    serviceId: '$_id'
                }
            }
        ]),
        serviceModel.countDocuments()
    ])
    const totalPages = Math.ceil(totalResults / limit);
    return {
        service, pagination: {
            totalResults,
            totalPages,
            currentPage: page,
            limit
        }
    };
}



const getServiceById = async (id) => {
    return await serviceModel.findById(id)
}


const allServiceService = async (options) => {
    const { page, limit } = options;
    const skip = (page - 1) * limit;
    const [result, totalResults] = await Promise.all([
        serviceModel.aggregate([
            {
                $skip: skip
            },
            {
                $limit: limit
            },
               {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'userInfo'
                }
            },
            {
                $unwind: {
                    path: "$userInfo",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'categoryInfo'

                }
            },
            {
                $unwind: {
                    path: "$categoryInfo",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    estimatedTimeMax: 1,
                    estimatedTimeMin: 1,
                    isDraft: 1,
                    needTools: 1,
                    haveTools: 1,
                    priceMax: 1,
                    priceMin: 1,
                    description: 1,
                    serviceName: 1,
                    image: 1,
                    categoryName: '$categoryInfo.name',
                    categoryImage: '$categoryInfo.image',
                    providerName: '$userInfo.fullName',
                    providerImage: '$userInfo.image',
                }
            }
        ]),
        serviceModel.countDocuments()
    ])
    return {
        result, pagination: {
            totalResults,
            totalPage: Math.ceil(totalResults / limit),
            currentPage: page,
            limit
        }
    }
}


module.exports = {
    addServiceService,
    updateServiceService,
    serviceDetailsService,
    getAllService,
    getServiceService,
    deleteServiceService,
    getServiceById,
    allServiceService
}
