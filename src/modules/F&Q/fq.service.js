const fqModel = require("./fq.model");

const addFQService = async (data) => {
    return await fqModel.insertMany(data);
}

const editFQService = async(id, data)=> {
    return await fqModel.findByIdAndUpdate(id, data, {new: true});
}

const deleteFQService = async(id)=> {
    return await fqModel.findOneAndDelete(id);
}
const allFQ = async (options) => {
  const { page = 1, limit = 10 } = options; // default values
  const totalResults = await fqModel.countDocuments();
  const skip = (page - 1) * limit;

  const result = await fqModel
    .find()
    .sort({ createdAt: -1 }) 
    .skip(skip)
    .limit(limit)
    .exec();

  return {
    result,
    pagination: {
      totalResults,
      totalPages: Math.ceil(totalResults / limit), 
      currentPage: page,
      limit,
    },
  };
};

module.exports = { addFQService, editFQService, deleteFQService,allFQ }