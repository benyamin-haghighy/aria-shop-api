const { default: mongoose } = require("mongoose");


const schema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    slug:{
        type:String,
        required:true,
        unique:true
    },
    parent:{
        type:mongoose.Types.ObjectId,
        ref:'category'
    },
    icon:{
        type:{
            fileName:{type:String,required:true},
            path:{type:String,required:true},
        }
    },
    descryption:{
        type:String
    },
    filters:{
        type:[{
            name:{
                type:String,
                required:true,
            },
            slug:{
                type:String,
                unique:true,
                required:true
            },
            type:{
                type:String,
                enum:['radio', 'checkbox'],
                required:true
            },
            descryption:{
                type:String
            },
            option:{
                type:[String],
                validator:{
                    validate:(option) => {
                        if (!Array.isArray(option)) {
                            return false
                        }
                    },
                }
            },
            min:Number,
            max:Number
        }]
    }
},{timestamps:true,strict:true})

module.exports = mongoose.model('category',schema)