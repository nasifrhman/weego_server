const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    typeofPerson: { type: String, required: false },
    rfc : { type: String, required: false },
    name: { type: String, required: false },
    lastName: { type: String, required: false },
    mothersName: { type: String, required: false },
    motherslastName: { type: String, required: false },
    email: { type: String, required: false },
});

module.exports = mongoose.model("Invoice", invoiceSchema);