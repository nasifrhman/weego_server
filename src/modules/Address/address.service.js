const addressModel = require("./address.model");


const addAddressService = async (data) => {
    return await addressModel.create(data);
}


const deleteAddressService = async (id) => {
    return await addressModel.findByIdAndDelete(id);
}


const updateAddressService = async (id, data) => {
    return await addressModel.findByIdAndUpdate(id, data, { new: true });
}

const myAddressService = async (id) => {
    return await addressModel.find({ user: id });
}   

module.exports = { addAddressService, deleteAddressService, updateAddressService, myAddressService };