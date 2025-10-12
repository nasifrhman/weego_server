const express = require("express");
const { allTransactions, transactionDetails, totalEarning, earningRatio } = require("./transaction.controller");
const { auth } = require("../../middlewares/auth");
const router = express.Router();


router.get('/alltransactions',allTransactions );
router.get('/totalearning', totalEarning);
router.get('/earning-ratio', auth(['admin']), earningRatio);
router.get('/transactionDetails/:id', transactionDetails );


module.exports = router