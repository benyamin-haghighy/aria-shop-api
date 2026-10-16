const { errorResponse, successResponse } = require('../../helper/reponses')
const { createPayment, verifyPayment } = require('../../service/zarinpal')
const cartModel = require('../cart/cart.model')
const orderModel = require('../orders/order.model')
const productModel = require('../product/product.model')
const sellerRequestModel = require('../sellerRequest/sellerRequest.model')
const checkoutModel = require('./checkout.model')
const { createCheckoutSchema } = require('./checkout.validate')
exports.create = async(req,res,next)=>{
    try {
        const user= req.user
        const {shippingAddress} =req.body
        await createCheckoutSchema.validate(req.body, {abortEarly:false})
        let cart = await cartModel.findOne({user:user._id}).populate('items.product').populate('items.seller')
        if (!(cart) || cart.items.length === 0) {
            return errorResponse(res,404, 'cart for this user is not found')
        }
        console.log(cart.totalPrice);
        
        let checkOutItems = []
        for (const item of cart.items) {
            const {product, seller} = item
            const isProductSeller = product.seller.find(s => {
                if (s.seller.equals(seller._id)) {
                    return true
                }
            })
            if (!isProductSeller) {
                return errorResponse(res,400,`${seller.name} Store is not among the suppliers of this ${product.name}.`)
            }
            if (isProductSeller.stock - item.quantity < 0) {
                return errorResponse(res,400,`The ${seller.name} store has ${isProductSeller.stock} of this product, but you cannot purchase more than that amount.`)
                
            }
            checkOutItems.push({...item})
        }
        await checkoutModel.syncIndexes()
        const objPayment = await createPayment({amount:cart.totalPrice,description:"this test payment",mobile:user.phone})
        await checkoutModel.create({user:user._id, checkOutItems, shippingAddress, authority:objPayment.authority})
        return successResponse(res,201,{message:"create paymentUrl is successFull",
            paymenUrl:objPayment.pamentUrl
        })
    } catch (error) {
        next(error)
    }
}
exports.verify = async(req,res,next)=>{
    try {
        const { Authority:authority, Status} = req.query
        
        const alreadyOrder = await orderModel.findOne({authority})
        if (alreadyOrder) {
            return errorResponse(res,400, 'payment already verify ')
        }
        const checkout = await checkoutModel.findOne({authority})
        console.log(checkout.totalPrice);
        
        if (!checkout) {
            return errorResponse(res,404, 'checkout not found')
        }
        const objVerify = await verifyPayment({amount:checkout.totalPrice, authority})
        if (!(objVerify.code !== 100 || objVerify!==101)) {
            return errorResponse(res,400, 'payment is not successFully')
        }
        const order = await orderModel.create({user:checkout.user, shippingAddress:checkout.shippingAddress, orderItems:checkout.checkOutItems, authority:checkout.authority})
        order.orderItems.forEach(async(item)=>{
            const product = await productModel.findOne({_id:item.product})
            for (const s of product.seller) {
                if (s.seller.equals(item.seller)) {
                    s.stock -= item.quantity
                }
            }
            await product.save()
        })
        await cartModel.updateOne({user:checkout.user},{items:[]})
        await checkout.deleteOne()
        return successResponse(res,201, {message:"Your order has been placed.",order})
        
    } catch (error) {
        next(error)
    }
}