const mongoose = require('mongoose');
const {isEmail} = require('validator')
const Schema = mongoose.Schema;
const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        unique: true,
        required: true,
        validate: [isEmail, 'filed must be a valid email address']
    },
    role:{
        type: String,
        required: false,
        unique: false,
        default: 'ADMIN',
    }
})

module.exports = mongoose.model('User', userSchema)