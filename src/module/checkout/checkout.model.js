const { default: mongoose } = require("mongoose");

const checkOutItemsSchema = new mongoose.Schema({
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
    checkOutItems:{
        type:[checkOutItemsSchema],
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
    authority:{
        type:String,
        unique:true,
        required:true
    },
    expire:{
        type:Date,
        default:Date.now
    }

},{timestamps:true})

schema.virtual('totalPrice').get(function(){
    return this.checkOutItems.reduce((total, item)=>{
        return total + (item.quantity * item.price)
    },0)
})
schema.index({expire:1}, {expireAfterSeconds:9 * 60})
module.exports = mongoose.model('checkout', schema)