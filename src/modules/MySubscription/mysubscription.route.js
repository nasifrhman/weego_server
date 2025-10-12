const express = require("express");
const { mySubscription, paymentController, paymentCompleteController } = require("./mysubscription.controller");
const { auth } = require("../../middlewares/auth");
const router = express.Router();


router.post('/payment', auth(['user']), paymentController)
router.get('/complete', paymentCompleteController)
router.get("/my-sub",auth(['user']), mySubscription);
// router.get("/cancel-subscription/:stripeSubscriptionId", cancelSubscription);


module.exports = router;