const { isValidObjectId } = require('mongoose')
const { successResponse, errorResponse } = require('../../helper/reponses')
const orderModel = require('./order.model')
const { updateOrderSchema } = require('./order.vaidate')
exports.getAllOrders = async(req,res,next)=>{
    try {
        const {page=1,limit=5}= req.query
        const user = req.user
        console.log(user);
        
        if (user.role.includes('ADMIN')) {
            let orders = await orderModel.find().sort({_id:-1}).skip((page-1) * limit).limit(limit).populate('orderItems.product').populate('orderItems.seller').populate('user')
            if (!orders) {
                return errorResponse(res,404, 'order for this shop is not found')
            }
            return successResponse(res,200, {pageNation:{
                page,
                limit,
                countPage:Math.ceil(orders.length/limit) < 0 ? 1: Math.ceil(orders.length),
                countOrders:orders.length
            },orders})
        }else if (user.role.includes('USER')) {
            const orders = await orderModel.find({user:user._id}).sort({_id:-1}).skip((page-1) * limit).limit(limit).populate('orderItems.product').populate('orderItems.seller').populate('user')
            if (!orders) {
                return errorResponse(res,404, 'user dosnt have order')
            }
            return successResponse(res,200, {pageNation:{
                page,
                limit,
                countPage:Math.ceil(orders.length/limit) < 0 ? 1: Math.ceil(orders.length),
                countOrders:orders.length
            },orders})
        }
    } catch (error) {
        next(error)
    }
}
exports.updateOrder = async(req,res,next)=>{
    try {
        const {id} = req.params
        if (!isValidObjectId(id)) {
            return errorResponse(res,400, 'id is not valid')
        }
        let {status,postTrackingCode} = req.body
        await updateOrderSchema.validate(req.body)
        const order = await orderModel.findOne({_id:id})
        if (!order) {
            return errorResponse(res,404,'order with id is not found')
        }
        await order.updateOne({postTrackingCode,status})
        return successResponse(res,201, {message:'update order successFully', order})
    } catch (error) {
        next(error)
    }
}