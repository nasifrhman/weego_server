const { default: status } = require("http-status");
const catchAsync = require("../../helpers/catchAsync");
const response = require("../../helpers/response");
const { addAddressService, deleteAddressService, updateAddressService, myAddressService } = require("./address.service");


const addAddressController = catchAsync(async (req, res) => {
    req.body.user = req.User._id;
    const result = await addAddressService(req.body)
    return res.status(status.CREATED).json(response({ status: 'Success', statusCode: status.CREATED, type: 'address', message: 'address-added', data: result }));
});


const deleteAddressController = catchAsync(async (req, res) => {
    const result = await deleteAddressService(req.params.id);
    return res.status(status.OK).json(response({ status: 'Success', statusCode: status.OK, type: 'address', message: 'delete-address', data: result }))
})


const updateAddressController = catchAsync(async (req, res) => {
    const result = await updateAddressService(req.params.id);
    return res.status(status.OK).json(response({ status: 'Success', statusCode: status.OK, type: 'address', message: 'address-edited', data: result }))
})


const myAddressController = catchAsync(async (req, res) => {
  const myaddress = await myAddressService(req.User._id);
  return res.status(status.OK).json(
    response({
      status: "Success",
      statusCode: status.OK,
      type: "address",
      message: "my-address",
      data: myaddress,
    })
  );
});


module.exports = { addAddressController, myAddressController, updateAddressController, deleteAddressController };