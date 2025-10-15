const mongoose = require('mongoose')

const adminSchema = mongoose.Schema({
    user: { type : mongoose.Schema.Types.ObjectId, ref: 'User'},
    adminRole: { type: String , enum : ['owner', 'sub-admin']},
    categoryPermissions: { type : [String] , enum : ['all' ,'contractor', 'provider', 'transaction']}
},
{ timestamps : true }
)

module.exports = mongoose.model('AdminModel', adminSchema)