const { default: mongoose } = require("mongoose");

const phoneSchema = new mongoose.Schema({
            phone:{
                type:String,
                required:true,
                trim:true
            }
        },{_id:false})
const shcema = new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:true,
        trim:true
    },
    contactDetails:{
        type:phoneSchema,
        required:true
    },
    cityId:{
        type:Number,
        required:true
    },
    user_id:{
        type:mongoose.Types.ObjectId,
        ref:"user",
        required:true
    }
},{timestamps:true, strict:true})

module.exports = mongoose.model('seller', shcema)