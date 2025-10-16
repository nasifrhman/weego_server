const privacyModel = require("./privacy.model");

const togglePrivacySetting = async (userId, field) => {
  const allowedFields = [
    "readReceipts",
    "ads",
    "showName",
    "showService",
    "isActivePushNotification",
    "availabilityOnHoliday"
  ];

  if (!allowedFields.includes(field)) {
    throw new Error("Invalid privacy field");
  }

  // Efficient one-step atomic toggle using aggregation operator
  const updatedPrivacy = await privacyModel.findOneAndUpdate(
    { user: userId },
    [
      {
        $set: {
          [field]: { $not: `$${field}` } // toggles boolean value directly
        }
      }
    ],
    { new: true, upsert: true } // creates if not exists
  );

  return updatedPrivacy;
};


const myPrivacyService = async (userId) => {
  return await privacyModel.findOne({ user: userId });
}

module.exports = { togglePrivacySetting , myPrivacyService };