const catchAsync = require("../../helpers/catchAsync");
require('dotenv').config();
const response = require("../../helpers/response");
const { status } = require("http-status");
const { getAllTransactions, getTransactionByIdWithPopulate, getMonthlyEarningRatio, getTotalEarning } = require("./transaction.service");





const allTransactions = catchAsync(async (req, res) => {
    const options = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        planId: req.query.planId || null,
        date: req.query.date || 'desc'  // 'asc' or 'desc'
    };

    const transactions = await getAllTransactions(options);
    return res.status(status.OK).json(response({ 
        status: 'Success', 
        statusCode: status.OK, 
        type: 'transaction', 
        message: 'all-transactions', 
        data: transactions 
    }));
});


const totalEarning = catchAsync(async (req, res) => {
    const total = await getTotalEarning();
    return res.status(status.OK).json(response({ status: 'Success', statusCode: status.OK, type: 'transaction', message: 'total-earning', data: total }));
})


const earningRatio = catchAsync(async (req, res) => {

    let year = Number(req.query.year) || new Date().getFullYear();
    const ratio = await getMonthlyEarningRatio(year);

    return res.status(status.OK).json(
        response({
            statusCode: status.OK,
            message: 'earning-ratio',
            data: ratio,
            status: 'ok',
        })
    );
});

const transactionDetails = catchAsync(async (req, res) => {
    const transaction = await getTransactionByIdWithPopulate(req.params.id);
    return res.status(status.OK).json(response({ status: 'Success', statusCode: status.OK, type: 'transaction', message: 'transaction-details', data: transaction }));
})


module.exports = { allTransactions, transactionDetails, totalEarning, earningRatio }