const mongoose = require("mongoose");


const feedbackSchema = new mongoose.Schema({
   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
   rating: { type: Number, required: true },
   text: { type: String, required: true }
},
   { timestamps: true }  
);



module.exports = mongoose.model('Feedback', feedbackSchema); 