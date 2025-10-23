const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    image: {type: String, required: false},
    name : { type: String, required: true},
    percentage: { type: Number, default: 0 },
},
{
    timestamps: true
})

module.exports = mongoose.model("Category", categorySchema)