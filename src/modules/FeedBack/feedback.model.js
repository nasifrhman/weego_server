const mongoose = require("mongoose");


const feedbackSchema = new mongoose.Schema({
   sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
   targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
   rating: { type: Number, required: true },
   image: [{ type: String, required: false }],
   text: { type: String, required: true }
},
   { timestamps: true }  
);



module.exports = mongoose.model('Feedback', feedbackSchema); 