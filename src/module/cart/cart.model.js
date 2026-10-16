const { default: mongoose } = require("mongoose");

const itemsSchema = new mongoose.Schema({
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
    items:{
        type:[itemsSchema],
        default:[]
    },

})
schema.virtual('totalPrice').get(function(){
    return this.items.reduce((total, item)=>{
        return total + (item.quantity * item.price)
    },0)
})
schema.pre("save", function(next){
    this.updatedAt = Date.now()
    next()
})

module.exports = mongoose.model('cart', schema)