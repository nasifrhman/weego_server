const express = require('express');
const {  allPlans, deletePlan, editPlan, addPlan } = require('./subscription.controller');
const router = express.Router();

router.post('/add', addPlan);
router.put('/edit/:id', editPlan);
router.get('/all', allPlans);
router.delete('/:id', deletePlan);

module.exports = router;