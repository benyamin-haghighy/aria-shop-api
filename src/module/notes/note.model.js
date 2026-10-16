const { default: mongoose } = require("mongoose");

const schema =new mongoose.Schema({
    product:{
        type:mongoose.Types.ObjectId,
        ref:"product",
        required:true
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:"user",
        required:true
    },
    content:{
        type:String,
        required:true
    }

},{timestamps:true,strict:true})

module.exports = mongoose.model('note', schema)