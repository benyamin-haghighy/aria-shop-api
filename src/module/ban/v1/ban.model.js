const { default: mongoose } = require("mongoose");


const schema = new mongoose.Schema({
    phone:{
        type:String,
        required:true,
        unique:true
    }
})

module.exports = mongoose.model('ban', schema)