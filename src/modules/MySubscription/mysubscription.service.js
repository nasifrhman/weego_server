const mysubscriptionModel = require("./mysubscription.model");


const getMySubscriptionService = async (data) => {
  return await mysubscriptionModel.findOne(data).populate('subscription').sort({ updatedAt: -1 });
}


module.exports = {
  getMySubscriptionService,
}





