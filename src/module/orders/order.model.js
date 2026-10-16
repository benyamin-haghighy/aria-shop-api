const { default: mongoose } = require("mongoose");

const orderItemsSchema = new mongoose.Schema({
    product:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:"product"
    },
    seller:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:"seller"
    },
    quantity:{
        type:Number,
        min:1,
        required:true
    },
    price:{
        type:Number,
        required:true
    }
})
const schema = new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:"user"
    },
    orderItems:{
        type:[orderItemsSchema],
        required:true
    },
    shippingAddress:{
        postalCode:{
            type:String,
            trim:true,
            required:true
        },
        cordinates:{
            lat:{
                type:Number,
                required:true
            },
            lag:{
                type:Number,
                required:true
            }
        },
        address:{
            type:String,
            required:true
        },
        cityId:{
            type:Number,
            required:true
        }
    },
    postTrackingCode:{
        type:String,
        trim:true,
        default:''
    },
    status:{
        type:String,
        enum:['PROCESSING', 'SHIPPED', 'DELIVERED'],
        default:"PROCESSING"
    },
    authority:{
        type:String,
        unique:true,
        required:true
    }

},{timestamps:true})


module.exports = mongoose.model('order', schema)