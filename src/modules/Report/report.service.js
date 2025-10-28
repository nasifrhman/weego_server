const reportModel = require("./report.model");


const addReportService = async (data) => {
    return reportModel.create(data)
}



const getAllReportService = async (options) => {
    const { page = 1, limit = 10 } = options;
    const [results, totalResults] = await Promise.all([
        reportModel.aggregate([
            { $sort: { createdAt: -1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit },
            {
                $lookup: {
                    from: 'users',
                    localField: 'reporter',
                    foreignField: '_id',
                    as: 'ReporterData'
                }
            },
            {
                $unwind: {
                    path: '$ReporterData',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup : {
                    from: 'users',
                    localField: 'targetUser',
                    foreignField: '_id',
                    as: 'targetUserData'
                }
            },
            {
                $unwind: {
                    path: '$targetUserData',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project : {
                    reporterName: '$ReporterData.fullName',
                    reporterImage: '$ReporterData.image',
                    targetUserName: '$targetUserData.fullName',
                    targetUserImage: '$targetUserData.image',
                    image: 1,
                    comment:1,
                    option: 1,
                    createdAt: 1
                }
            }
        ]),
        reportModel.countDocuments()
    ])
    return {
        result: results,
        pagination: {
            totalResults,
            totalPages: Math.ceil(totalResults / limit),
            currentPage: page,
            limit,
        },
    };
}


module.exports = { addReportService, getAllReportService };