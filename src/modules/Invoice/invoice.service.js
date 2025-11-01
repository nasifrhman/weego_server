const invoiceModel = require("./invoice.model");


const addInvoiceService = async (data) => {
    return await invoiceModel.create(data);
}

const editInvoiceService = async(id, data)=> {
    return await invoiceModel.findByIdAndUpdate(id, data, {new: true});
}


const deleteInvoiceService = async(id)=> {
    return await invoiceModel.findOneAndDelete(id);
}

const myAllInvoice = async (user, options) => {
  const { page = 1, limit = 10 } = options;
  const totalResults = await invoiceModel.countDocuments({user: user});
  const skip = (page - 1) * limit;

  const result = await invoiceModel
    .find({user: user})
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


module.exports = { addInvoiceService, editInvoiceService, deleteInvoiceService, myAllInvoice }