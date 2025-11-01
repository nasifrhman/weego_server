const { default: mongoose } = require("mongoose");
const Discount = require("./discount.model");


const addDiscountService = async (data) => {
  return await Discount.create(data);
}


const editDiscountService = async (id, data) => {
  return await Discount.findByIdAndUpdate(id, data, { new: true });
}


const deleteDiscountService = async (id) => {
  return await Discount.findByIdAndDelete(id);
}




const myAllDiscount = async (provider, options) => {
  const { page = 1, limit = 10 } = options;
  const skip = (page - 1) * limit;

  const [result, totalResults] = await Promise.all([
    await Discount.aggregate([
      { $match: { provider: new mongoose.Types.ObjectId(String(provider)) } },
      { $sort: { updatedAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'services',
          localField: 'service',
          foreignField: '_id',
          as: 'serviceDetails'
        }
      },
      { $unwind: { path: '$serviceDetails', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          title: 1,
          discount: 1,
          discountType: 1,
          discountLimit: 1,
          userLimit: 1,
          startDate: 1,
          endDate: 1,
          serviceName: '$serviceDetails.serviceName',
          serviceId: '$serviceDetails._id'
        }
      },
    ]),
    await Discount.countDocuments({ provider: new mongoose.Types.ObjectId(String(provider)) })
  ]);
  const totalPages = Math.ceil(totalResults / limit);
  return {
    results: result,
    currentPage: page,
    limit,
    totalPages,
    totalResults
  };
};



module.exports = {
  addDiscountService,
  editDiscountService,
  deleteDiscountService,
  myAllDiscount
}