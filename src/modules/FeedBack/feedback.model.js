const mongoose = require("mongoose");


const feedbackSchema = new mongoose.Schema({
   sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
   service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
   rating: { type: Number, required: true },
   image: [{ type: String, required: false }],
   text: { type: String, required: true }
},
   { timestamps: true }  
);



module.exports = mongoose.model('Feedback', feedbackSchema); 