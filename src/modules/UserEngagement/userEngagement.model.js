const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
    provider: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    contractor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
    price: { type: Number, default: 0 },
},
    { timestamps: true });


module.exports = mongoose.model("UserEngagement", invoiceSchema);