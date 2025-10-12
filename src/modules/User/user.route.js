const express = require('express');
const { userDetails, updateProfile, allUsers, userRatio, userDetailsByID, banUserController, unbanUserController, completeProfileController, changeCurrentTrainning, deleteAccountController, countController, deleteUserAccount, seeOwnReferalCode,} = require('./user.controller');
const router = express.Router();


const userFileUploadMiddleware = require("../../middlewares/fileUpload");
const UPLOADS_FOLDER_USERS = "./public/uploads/users";
const uploadUsers = userFileUploadMiddleware(UPLOADS_FOLDER_USERS);
const { auth } = require('../../middlewares/auth')
const convertHeicToPng = require('../../middlewares/converter');
const ensureUploadFolderExists = require('../../helpers/fileExists');
const parseData = require('../../middlewares/parseData');
ensureUploadFolderExists(UPLOADS_FOLDER_USERS);



router.get('/user-details', auth(['user', 'admin']), userDetails);
router.get('/count', countController);
router.get('/see-referal-code', auth(['user']), seeOwnReferalCode);
router.delete('/delete-account',  auth(['user', 'admin']), deleteUserAccount);
router.get('/all',  auth(['admin']), allUsers);
router.get('/user-ratio',  auth(['admin']), userRatio);
router.put('/update', uploadUsers.single('profileImage'), convertHeicToPng(UPLOADS_FOLDER_USERS),  auth(['user', 'business', 'admin']),parseData(), updateProfile);
router.put("/ban/:userId",  auth(['admin']), banUserController);
router.put("/unban/:userId",  auth(['admin']), unbanUserController);
router.put('/complete',auth(['user']), completeProfileController);
router.post('/change-currentTrainning',auth(['user']), changeCurrentTrainning );
router.get('/userbyId/:id',  auth(['user', 'admin']), userDetailsByID);



module.exports = router;  