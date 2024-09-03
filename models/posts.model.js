const mongoose = require('mongoose');
const postSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    decs:{
        type:String,
        required:true
    },
    user_id:{
        type:String,
        required:true
    },
    user_name:{
        type:String,
        requried:true,

    }
})
module.exports = mongoose.model('Post', postSchema)