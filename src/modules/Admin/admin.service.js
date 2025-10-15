const { addUser } = require("../Auth/auth.service");
const adminModel = require("./admin.model");

const addAdminService = async (data) => {
    const result = adminModel.create(data);
    result && await addUser({
        fullName: data.fullName,
        formatted_phone_number: data.formatted_phone_number,
        password: process.env.ADMIN_PASSWORD,
        role : 'admin',
        isAdmin: true
    })
    return result;
}


const allAdminService = async (options) => {
    const { page = 1, limit = 10 } = options;
    const [result, totalResults] = await Promise.all([
        adminModel.aggregate([
            { $match: { adminRole: { $ne: 'owner' } } },
            { $skip: (page - 1) * limit },
            { $limit: limit },
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'userInfo'
                }
            },
            { $unwind: { path: '$userInfo', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    fullName: 'userInfo.fullName',
                    image: 'userInfo.image',
                    email: 'userInfo.email',
                    formatted_phone_number: 'userInfo.formatted_phone_number',
                    categoryPermissions: 1
                }
            }
        ]),
        adminModel.countDocuments({ adminRole: { $ne: 'owner' } })
    ])

    return {
        result,
        pagination: {
            totalResults,
            totalPages: Math.ceil(totalResults / limit),
            currentPage: page,
            limit
        }
    }
}


const getAdminByUserId = async (id) => {
    return adminModel.findOne({ user: id })
}

module.exports = {
    addAdminService,
    getAdminByUserId,
    allAdminService
}