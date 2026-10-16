const { errorResponse, successResponse } = require('../../helper/reponses')
const productModel = require('../product/product.model')
const sellerModel = require('../seller/seller.model')
const cartModel= require('./cart.model')
const { addToCartSchema, removeFromCartSchema } = require('./cart.validate')

exports.get = async(req,res,next)=>{
    try {
        const user = req.user._id
        const cart = await cartModel.findOne({user}).populate('items.product').populate('items.seller')
        if (!cart) {
            return errorResponse(res,404, 'user dosnt have cart for remove product')
        }
        if (cart.items.length === 0) {
            return errorResponse(res,400, 'user dosnt have products in cart')
        }
        return successResponse(res,200, {products:cart.items})
    } catch (error) {
        next(error)
    }
}
exports.add = async(req,res,next)=>{
    try {
        const user = req.user._id
        const {productId, sellerId, quantity} = req.body
        await addToCartSchema.validate(req.body, {abortEarly:false})
        const product = await productModel.findOne({_id:productId})
        if (!product) {
            return errorResponse(res,404, 'product for add to this cart is not found')
        }
        const seller = await sellerModel.findOne({_id:sellerId})
        if (!seller) {
            return errorResponse(res,404, 'seller is not exist')
            
        }
        const sellerDetails = product.seller.find(s => {
            return s.seller.equals(sellerId)
        })
        if (!sellerDetails) {
            return  errorResponse(res,400, 'seller dosnt sell this product')
        }
        
        let cart = await cartModel.findOne({user})
        if (cart) {
            const isProductInCart = cart.items.some(p => {
                return p.product.equals(productId)
            })
            if (!isProductInCart) {
                if (sellerDetails.stock < quantity) {
                    return  errorResponse(res,400, 'seller dosnt have this quantity fot this product')

                }
                await cart.updateOne({$push:{
                    items:{
                        product:productId,
                        seller:sellerId,
                        price:sellerDetails.price,
                        quantity:Number(quantity)
                    }
                }})
            }else{
                const productHasThisSeller = cart.items.find(i => {
                    if (i.product.equals(productId) && i.seller.equals(sellerId)) {
                        return true
                    }
                })
                if (productHasThisSeller) {
                    if (sellerDetails.stock < productHasThisSeller.quantity + Number(quantity)) {
                       return  errorResponse(res,400, 'seller dosnt have this quantity fot this product')
                    }      
                    newItems = cart.items.map(p => {
                    if (p.product.equals(productId) && p.seller.equals(sellerId)) {
                        if (p.quantity + Number(quantity) > sellerDetails.stock) {
                            return errorResponse(res,400, 'seller dosnt have this quantity for this product')
                        }
                        p.quantity += Number(quantity)
                    }
                        return p
                    })
                    cart.items = newItems
                    await cart.save()
                }else{
                    await cart.updateOne({$push:{
                        items:{
                            seller:sellerId,
                            product:productId,
                            quantity,
                            price:sellerDetails.price
                        }
                    }})
                }
            }
            
        }else{
            if (sellerDetails.stock < quantity) {
                return  errorResponse(res,400, 'seller dosnt have this quantity fot this product')
            
            }
            cart = await cartModel.create({
                user,
                items:[
                    {
                        product:productId,
                        seller:sellerId,
                        price:sellerDetails.price,
                        quantity
                    }
                ]
            })
        }
        return successResponse(res,201, {message:'item add to cart successFully',cart})
    } catch (error) {
        next(error)
    }
}
exports.remove = async(req,res,next)=>{
    try {
        const user = req.user._id
        const {productId, sellerId} = req.body
        await removeFromCartSchema.validate(req.body,{abortEarly:false})
        const cart = await cartModel.findOne({user})
        if (!cart) {
            return errorResponse(res,404, 'user dosnt have cart for remove product')
        }
        const product = await productModel.findOne({_id:productId})
        if (!product) {
            return errorResponse(res,404, 'product for remove from this cart is not found')
        }
        const seller = await sellerModel.findOne({_id:sellerId})
        if (!seller) {
            return errorResponse(res,404, 'seller is not exist')
            
        }
        const cartHasProduct = cart.items.some(i =>{
            if (i.product.equals(productId) && i.seller.equals(sellerId) ) {
                return true
            }
        })

        if (!cartHasProduct) {
            return errorResponse(res,400, 'your cart dosnt have product with seller')
        }
        let countProduct = null
        const newItems = cart.items.filter(i =>{
            if (i.product.equals(productId) && i.seller.equals(sellerId) ) {
                i.quantity--
                if (i.quantity === 0) {
                    return false
                }
                countProduct = i.quantity
            }
            return true
        })
        cart.items = newItems
        await cart.save()
        return successResponse(res,200, {message:countProduct?`One unit has been deducted from the product inventory; remaining quantity:${countProduct}`:'product remove successFully',cart})
    } catch (error) {
        next(error)
    }
}