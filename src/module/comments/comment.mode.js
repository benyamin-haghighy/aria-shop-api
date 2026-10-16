const { default: mongoose } = require("mongoose");

const replySchema = new mongoose.Schema({
    user:{type:mongoose.Types.ObjectId, ref:"user", required:true},
    content:{type:String, required:true},
},{timestamps:true})
const schema = new mongoose.Schema({
    product:{
        type:mongoose.Types.ObjectId,
        ref:'product',
        required:true
    },
     user:{
        type:mongoose.Types.ObjectId,
        ref:'user',
        required:true
    },
     content:{
        type:String,
        required:true
    },
     replies:{
        type:[replySchema],
        default:[]
    },
     score:{
        type:Number,
        min:1,
        max:5,
        default:3
    },
},{timestamps:true})

module.exports = mongoose.model('comment', schema)