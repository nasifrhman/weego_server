const serviceAnnexModel = require("./serviceAnnex.model");


const newRequestService = async (data) => {
    return await serviceAnnexModel.create(data);
}

const editRequestService = async (id, data) => {
    return await serviceAnnexModel.findByIdAndUpdate(id, data, { new: true });
}


const requestContructorEndService = async (filter) => {
    console.log(filter)
    return await serviceAnnexModel.aggregate([
        { $match: filter },
        {
            $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'categoryDetails'
            }
        },
        { $unwind: '$categoryDetails' },
        {
            $lookup: {
                from: 'users',
                localField: 'providor',
                foreignField: '_id',
                as: 'providorDetails'
            }
        },
        { $unwind: '$providorDetails' },
        {
            $project: {
                reason: 1,
                description: 1,
                cost: 1,
                status: 1,
                paymentStatus: 1,
                reschedule: 1,
                createdAt: 1,
                category: '$categoryDetails.name',
                providerName: '$providorDetails.fullName',
                providerImage: '$providorDetails.image'
            }
        }
    ]);
};


module.exports = { newRequestService, requestContructorEndService, editRequestService };