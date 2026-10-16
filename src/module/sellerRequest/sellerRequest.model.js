const { default: mongoose } = require("mongoose");

const schema = new mongoose.Schema({
    seller:{
        type:mongoose.Types.ObjectId,
        ref:'seller',
        required:true
    },
    product:{
        type:mongoose.Types.ObjectId,
        ref:'product',
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:['pending', 'accepted', 'rejected'],
        default:"pending"
    },
    stateComment:{
        type:String,
        trim:true
    }
},{timestamps:true, strict:true})

module.exports = mongoose.model('sellerRequest', schema)