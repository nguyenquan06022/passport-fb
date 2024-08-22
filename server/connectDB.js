const mongoose = require('mongoose')

function connect() {
    try {
        mongoose.connect('mongodb+srv://testuser:testuser@cluster0.ygwf0n5.mongodb.net/fbtest')
        console.log('connect success')
    } catch (error) {
        console.log('error')
    }
}

module.exports = {connect}