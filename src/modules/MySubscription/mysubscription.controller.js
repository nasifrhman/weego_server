const { default: status } = require("http-status");
const catchAsync = require("../../helpers/catchAsync");
const mongoose = require("mongoose");
const ApiError = require("../../helpers/ApiError");
const { subscriptionByID } = require("../Subscription/subscription.service");
const MySubscription = require("./mysubscription.model");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const util = require('util');
const transactionModel = require("../Transaction/transaction.model");
const response = require("../../helpers/response");
const { getMySubscriptionService } = require("./mysubscription.service");
const { getUserById } = require("../User/user.service");



const mySubscription = catchAsync(async (req, res) => {
  const result = await getMySubscriptionService({ user: req.User._id });
  return res.status(status.OK).json(response({
    status: 'Success',
    statusCode: status.OK,
    type: 'my subscription',
    message: "my subscription fetched",
    data: result
  }));
});


const paymentController = catchAsync(async (req, res) => {
  const { subscription, stripePriceId } = req.body;
  // console.log("subscription, stripePriceId:::", { subscription, stripePriceId });
  const user = req.User._id.toString();
  //uncomment
  // const userData = await getUserById(user);
  // if (userData.trialUser) throw new ApiError(status.BAD_REQUEST, "You have already used your trial period.");

  // Get the subscription details
  const subscriptionDoc = await subscriptionByID(subscription);

  if (!subscriptionDoc) {
    throw new ApiError(status.BAD_REQUEST, "Subscription not found");
  }

  // Check if this plan has a trial period
  const isTrialPlan = stripePriceId === 'price_1S22m9LgJ7PlOaifoKZ1bh8D'; // Adjust for your plan's price ID
  const trialPeriodDays = 7; // Set the trial duration (7 days, for example)

  // Prepare subscription data with trial info
  const subscriptionData = {
    metadata: { user_id: user, plan_id: subscription, plan_name: subscriptionDoc.planName },
    ...(isTrialPlan && { trial_period_days: trialPeriodDays })
  };
  console.log("meta:::", { user_id: user, plan_id: subscription, plan_name: subscriptionDoc.planName });

  // Create Stripe Checkout session
  const session = await stripe.checkout.sessions.create({
    success_url: `http://${process.env.API_SERVER_IP}:${process.env.BACKEND_PORT}/api/v1/my-subscription/complete?session_id={CHECKOUT_SESSION_ID}&subscription=${subscription}&user=${user}&planName=${subscriptionDoc.planName}`,
    cancel_url: `http://${process.env.API_SERVER_IP}:${process.env.BACKEND_PORT}/api/v1/my-subscription/cancel`,
    line_items: [{ price: stripePriceId, quantity: 1 }],
    mode: 'subscription',
    customer_email: req.User.email,
    subscription_data: subscriptionData,
    metadata: { user_id: user, plan_id: subscription, plan_name: subscriptionDoc.planName }
  });

  return res.status(status.OK).json(response({
    status: 'Success',
    statusCode: status.OK,
    type: 'Stripe Checkout Session',
    message: "Stripe Checkout Session created",
    data: { sessionId: session.id, url: session.url }
  }));
});


const paymentCompleteController = catchAsync(async (req, res) => {
  const { session_id, user, subscription, planName } = req.query;
  // console.log("paymentCompleteController query:::", session_id, user, subscription, planName);
  const sessionIdClean = session_id.replace(/[{}]/g, '');

  // Retrieve the Stripe session
  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionIdClean, {
    expand: ['subscription', 'subscription.latest_invoice.payment_intent']
  });

  const stripeSubscription = checkoutSession.subscription;
  if (!stripeSubscription) {
    throw new ApiError(status.BAD_REQUEST, "No subscription found in session");
  }

  const isTrial = stripeSubscription.status === 'trialing';
  const trialEndDate = isTrial ? new Date(stripeSubscription.trial_end * 1000) : null;
  const expiryDate = new Date(isTrial ? stripeSubscription.trial_end * 1000 : Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now if not trial

  // Create the MySubscription record
  await MySubscription.create({
    user: new mongoose.Types.ObjectId(String(user)),
    subscription: new mongoose.Types.ObjectId(String(subscription)),
    subscriptionId: stripeSubscription.id,
    customerId: checkoutSession.customer,
    planName: planName,
    isTrial,
    trialEndDate,
    expiryDate,
  });
  if (isTrial) {
    console.log("isTrial true:::", isTrial);
    const userData = await getUserById(user);
    userData.trialUser = true;
    userData.planName = planName;
    await userData.save();
  }


  // If it's not a trial, create the transaction
  if (!isTrial) {
    // console.log("paymentIntentId: ",stripeSubscription.latest_invoice.payment_intent.id)
    const transaction = new transactionModel({
      user,
      subscription,
      // transactionId: stripeSubscription.latest_invoice.payment_intent.id,
      // paymentIntentId: stripeSubscription.latest_invoice.payment_intent.id,
      amount: stripeSubscription.latest_invoice.amount_paid / 100, // Convert from cents to dollars
      paymentStatus: 'succeeded',
      invoiceId: stripeSubscription.latest_invoice.id,
    });

    console.log("amount: ", stripeSubscription.latest_invoice.amount_paid / 100)
    console.log("invoiceId: ", stripeSubscription.latest_invoice.id)

    console.log("transaction1:::", transaction);
    await transaction.save();
  }

  return res.status(status.OK).json({ message: 'Subscription and transaction processed successfully.' });
});

const stripeWebhook = catchAsync(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = 'whsec_068e950441689e921887f519eedd6b0e811605dd4ee3e031cb3dcfc05650be7d'; // Replace with your actual webhook secret

  let event;
  try {
    console.log('Received Stripe event:', sig);
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log('Event received:', event);

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;

      case 'invoice.paid':
        await handleInvoicePaymentSucceeded(event.data.object); // Reuse the logic for paid invoices
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.status(status.OK).json({ received: true });
  } catch (err) {
    console.error('Webhook Error:', err);
    return res.status(status.BAD_REQUEST).send(`Webhook Error: ${err.message}`);
  }
});

const handleSubscriptionCreated = async (eventData) => {
  console.log("handleSubscriptionCreated eventData::", util.inspect(eventData, { depth: null }));
  try {
    // Extract data from event
    const user = eventData.customer;
    const subscription = eventData.subscription;
    const planName = eventData.planName || 'Default Plan';

    const expiryDate = new Date(eventData.current_period_end * 1000); // Set the correct expiry date from Stripe data

    // Instantiate ObjectId correctly
    const userId = new mongoose.Types.ObjectId(String(user));
    const planId = new mongoose.Types.ObjectId(String(subscription));

    // Now save the subscription or perform any other logic
    await MySubscription.create({
      userId,
      planId,
      planName,
      expiryDate
    });

    console.log("Subscription created successfully!");
  } catch (error) {
    console.error("Error handling subscription creation: ", error.message);
  }
};

const handleInvoicePaymentSucceeded = async (invoice) => {
  console.log("Invoice Payment Succeeded:", invoice);

  if (!invoice.subscription) {
    console.error('Invoice does not contain a subscription ID:', invoice.id);
    return;
  }

  const subscriptionId = invoice.subscription;
  console.log("Subscription ID:", subscriptionId);

  try {
    // Find the MySubscription record for the subscriptionId
    const mySubscription = await MySubscription.findOne({
      subscriptionId: new mongoose.Types.ObjectId(String(subscriptionId)),
    });

    if (!mySubscription) {
      console.error('Subscription not found for invoice:', invoice.id);
      return;
    }

    // If this subscription was on a trial and is now paying, update the subscription
    if (mySubscription.isTrial) {
      // Extend the expiry date by the renewal period (e.g., 30 days)
      const renewalPeriod = 30; // Example renewal period, can be adjusted
      mySubscription.expiryDate = new Date(Date.now() + renewalPeriod * 24 * 60 * 60 * 1000); // Set new expiry date

      // Update the `isTrial` status to false
      mySubscription.isTrial = false;

      // Save the updated subscription
      await mySubscription.save();

      console.log('MySubscription updated after trial renewal:', mySubscription);
    }

    // Create a new transaction for the successful payment
    const transaction = new transactionModel({
      user: mySubscription.user,
      subscription: mySubscription.subscription,
      amount: invoice.amount_paid / 100, // Convert cents to dollars
      paymentStatus: 'succeeded',
      invoiceId: invoice.id,
    });

    await transaction.save();
    console.log('Transaction created for subscription renewal:', transaction);

  } catch (error) {
    console.error('Error processing invoice payment succeeded:', error);
  }
};

const handleCheckoutSessionCompleted = async (session) => {
  console.log("handleCheckoutSessionCompleted session::", session);
  const subscriptionId = session.subscription;
  console.log("handleCheckoutSessionCompleted subscriptionId::", subscriptionId);

  if (!subscriptionId || subscriptionId.length !== 24) {
    console.error('Invalid subscription ID:', subscriptionId);
    return; // Exit if the subscription ID is invalid
  }

  try {
    const mySubscription = await MySubscription.findOne({
      subscriptionId: new mongoose.Types.ObjectId(String(subscriptionId)), // Ensure ObjectId
    });

    if (!mySubscription) {
      console.error('Subscription not found:', subscriptionId);
      return;
    }

    console.log('Checkout session completed, subscription found:', mySubscription);
    // Additional logic to update subscription or trigger actions
  } catch (error) {
    console.error('Error processing checkout session:', error);
  }
};



module.exports = { mySubscription, paymentController, paymentCompleteController, stripeWebhook };