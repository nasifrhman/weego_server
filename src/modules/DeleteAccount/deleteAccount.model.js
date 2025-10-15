const mongoose = require("mongoose");

const deleteAccountSchema = new mongoose.Schema({
    user : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    youliveIn : { type: String },
    reason : { type: String },
},
{ timestamps: true});

module.exports = mongoose.model("DeleteAccount", deleteAccountSchema);