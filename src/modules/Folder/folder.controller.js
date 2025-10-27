const { default: status } = require("http-status");
const catchAsync = require("../../helpers/catchAsync");
const response = require("../../helpers/response");
const { default: mongoose } = require("mongoose");
const { deleteFolderService, myFolderService, addFolderService } = require("./folder.service");


const addFolder = catchAsync(async (req, res) => {
    req.body.user = req.User._id;
    const result = await addFolderService(req.body)
    return res.status(status.CREATED).json(response({ status: 'Success', statusCode: status.CREATED, type: 'folder', message: 'folder-added', data: result }));
});


const deleteFolder = catchAsync(async (req, res) => {
    const result = await deleteFolderService(req.params.folderId);
    return res.status(status.OK).json(response({ status: 'Success', statusCode: status.OK, type: 'folder', message: 'delete-folder', data: result }))
})


const myFolder = catchAsync(async (req, res) => {
  const filter = { user: new mongoose.Types.ObjectId(String(req.User._id)) };
  const myFolder = await myFolderService(filter);
  return res.status(status.OK).json(
    response({
      status: "Success",
      statusCode: status.OK,
      type: "folder",
      message: "my-folder",
      data: myFolder,
    })
  );
});

module.exports = { addFolder, myFolder, deleteFolder };