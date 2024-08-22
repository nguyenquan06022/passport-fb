const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userModel = new Schema({
    username : String,
    id : String,
    email : String
})

module.exports = mongoose.model('user',userModel)