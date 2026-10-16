const { default: mongoose } = require("mongoose");
const sellerSchema = new mongoose.Schema({
     seller:{
        type:mongoose.Types.ObjectId,
        ref:'seller',
    },
    price:{
        type:Number,
        required:true
    },
    stock:{
        type:Number,
        required:true
    }
},{_id:false})
const schema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    
    slug:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    subCategory:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:'subCategory',
    },
    descryption:{
        type:String,
        required:true,
        trim:true

    },
    images:{
        type:[
            {
                name:{
                    type:String,
                    required:true,
                }
            }
        ]
    },
    seller:{
        type:[
            {type:sellerSchema}
        ],
        default:[]
    },
    filterValue:{
        type:Map,
        of:mongoose.Types.Mixed,
        required:true
    },
    customFilter:{
        type:Map,
        of:String,
        unique:true
    },
    shortUrl:{
        type:String,
        required:true,
        unique:true
    }

},{timestamps:true,strict:true})

module.exports = mongoose.model('product', schema)