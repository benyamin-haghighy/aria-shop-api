const { default: mongoose } = require("mongoose");

const addressSchema = new  mongoose.Schema({
    name:{type:String, required:true},
    postalCode:{type:String, required:true},
    address:{type:String, required:true},
    cityId:{type:Number, required:true}
})

const userSchema = new mongoose.Schema({
    phone:{
        type:String,
        required:true
    },
    role:{type:[String],enum:['ADMIN', 'USER', 'SELLER'],default:['USER']},
    address:[addressSchema]
},{timestamps:true,strict:true})

module.exports = mongoose.model('user', userSchema)