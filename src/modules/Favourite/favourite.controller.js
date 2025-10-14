const { default: status } = require("http-status");
const { unFavouriteService, addFavouriteService, myFavouriteService } = require("./favourite.service");
const catchAsync = require("../../helpers/catchAsync");
const response = require("../../helpers/response");
const { default: mongoose } = require("mongoose");

const addFavourite = catchAsync(async (req, res) => {
    req.body.user = req.User._id;
    const result = await addFavouriteService(req.body)
    return res.status(status.CREATED).json(response({ status: 'Success', statusCode: status.CREATED, type: 'favourite', message: 'favourite-added', data: result }));
});

const unFavourite = catchAsync(async (req, res) => {
    const unfav = await unFavouriteService({ user: req.User._id, service: req.params.id });
    return res.status(status.OK).json(response({ status: 'Success', statusCode: status.OK, type: 'favourite', message: 'unfavourited', data: unfav }))
})

const myFavourite = catchAsync(async (req, res) => {
  const options = {
    page: parseInt(req.query.page || 1) ,
    limit: parseInt(req.query.limit || 10) 
  };
  const filter = { user: new mongoose.Types.ObjectId(String(req.User._id)) };
  const myFavourite = await myFavouriteService(filter, options);
  return res.status(status.OK).json(
    response({
      status: "Success",
      statusCode: status.OK,
      type: "favourite",
      message: "my-favourite",
      data: myFavourite,
    })
  );
});

module.exports = { addFavourite, myFavourite, unFavourite };