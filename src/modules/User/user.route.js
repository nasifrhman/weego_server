const express = require('express');
const { userDetails, updateProfile, allUsers, userRatio, userDetailsByID, banUserController, completeProfileController, countController, deleteUserAccount,} = require('./user.controller');
const router = express.Router();


const userFileUploadMiddleware = require("../../middlewares/fileUpload");
const UPLOADS_FOLDER_USERS = "./public/uploads/users";
const uploadUsers = userFileUploadMiddleware(UPLOADS_FOLDER_USERS);
const { auth } = require('../../middlewares/auth')
const convertHeicToPng = require('../../middlewares/converter');
const ensureUploadFolderExists = require('../../helpers/fileExists');
const parseData = require('../../middlewares/parseData');
ensureUploadFolderExists(UPLOADS_FOLDER_USERS);



router.get('/user-details', auth(['provider', 'contractor', 'admin']), userDetails);
router.get('/count', auth(['admin']), countController);
router.delete('/delete-account', auth(['provider', 'contractor', 'admin']), deleteUserAccount);
router.get('/all',  auth(['admin']), allUsers);
router.get('/user-ratio',  auth(['admin']), userRatio);
router.put('/update', uploadUsers.single('profileImage'), convertHeicToPng(UPLOADS_FOLDER_USERS), auth(['provider', 'contractor', 'admin']), parseData(), updateProfile);
router.put("/ban/:userId",  auth(['admin']), banUserController);
router.put('/complete', auth(['provider', 'contractor', 'admin']), completeProfileController);
router.get('/userbyId/:id', auth(['provider', 'contractor', 'admin']), userDetailsByID);



module.exports = router;  