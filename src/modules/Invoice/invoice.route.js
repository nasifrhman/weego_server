const express = require('express');
const { auth } = require('../../middlewares/auth');
const { addInvoiceController, myAllInvoiceController, editInvoiceController, deleteInvoiceController } = require('./invoice.controller');
const router = express.Router();

router.post('/add',auth(['contractor']), addInvoiceController);
router.get('/my-invoice', auth(['contractor']), myAllInvoiceController);
router.put('/:id',auth(['contractor']), editInvoiceController);
router.delete('/:id',auth(['contractor']), deleteInvoiceController);


module.exports = router;