const mongoose = require('mongoose')

const schemaFlag = new mongoose.Schema({
    flag: String
}, { _id: false })

module.exports = mongoose.model('Flag',schemaFlag) 