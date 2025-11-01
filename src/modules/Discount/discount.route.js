const express = require('express');
const { addDiscount, editDiscount, deleteDiscount, myDiscount, getAllDiscountServiceController } = require('./discount.controller');
const { auth } = require('../../middlewares/auth');
const router = express.Router();

router.post('/add', auth(['provider']), addDiscount);
router.get('/all',auth(['provider']), myDiscount);
router.put('/:id',auth(['provider']), editDiscount);
router.delete('/:id',auth(['provider']), deleteDiscount);


module.exports = router;