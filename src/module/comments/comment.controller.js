const { isValidObjectId } = require("mongoose")
const { errorResponse, successResponse } = require("../../helper/reponses")
const productModel = require("../product/product.model")
const commentModel = require("./comment.mode")
const { createCommentSchema, createAplyCommentSchema } = require('./comment.validate')
exports.getAllComments = async(req,res,next)=>{
    try {
        const {page=1, limit=10} = req.query
        const comments = await commentModel.find()
                                .populate('user', '-address')
                                .populate('product')
                                .populate('replies.user', '-address')
                                .sort({_id:"desc"})
                                .skip((page-1)*limit)
                                .limit(limit)
        return successResponse(res,200, {comments})
    } catch (error) {
        next(error)
    }
}
exports.create = async(req,res, next)=>{
    try {
        const {id} = req.params
        const {content, score} = req.body
        await createCommentSchema.validate(req.body, {abortEarly:false})
        if (!isValidObjectId(id)) {
            return errorResponse(res,400, 'id product is not valid')
            
        }
        const user= req.user
        const product = await productModel.findOne({_id:id})
        if (!product) {
            return errorResponse(res,404, 'product for create this comment is not found')
        }
        const comment = await commentModel.create({user:user._id, product:id, content, score})
        return successResponse(res,201,{message:"comment create successFully", comment})
    } catch (error) {
        next(error)
    }
}
exports.getAll = async(req,res, next)=>{
    try {
        const {id} = req.params
        if (!isValidObjectId(id)) {
            return errorResponse(res,400, 'id product is not valid')
            
        }
        const product = await productModel.findOne({_id:id})
        if (!product) {
            return errorResponse(res,404, 'product for create this comment is not found')
        }
        const comments = await commentModel.find({product:product._id})
            .populate('user', 'phone')
            .populate('replies.user')
            .sort({_id:"desc"}).lean()
        return successResponse(res,200, {comments})
    } catch (error) {
        next(error)
    }
}
exports.reply = async(req,res, next)=>{
    try {
        const {id} = req.params
        const user = req.user._id
        let {content} = req.body
        await createAplyCommentSchema.validate({content})
        if (!isValidObjectId(id)) {
            return errorResponse(res,400, 'id product is not valid')
            
        }
        const comment = await commentModel.findOne({_id:id})
        if (!comment) {
            return errorResponse(res,404, 'comment for reply is not found')
        }
        await comment.replies.push({user,content})
        await comment.save()
        return successResponse(res,201,{message:"reply is create successFully", comment})
    } catch (error) {
        next(error)
    }
}

exports.updateReply = async(req,res, next)=>{
    try {
        
    } catch (error) {
        next(error)
    }
}
exports.deleteReply = async(req,res, next)=>{
    try {
        const {id} = req.params
        const user = req.user._id
        if (!isValidObjectId(id)) {
            return errorResponse(res,400, 'id product is not valid')
            
        }
        const commentReply = await commentModel.findOne({'replies._id':id})
        if (!commentReply) {
            return errorResponse(res,404, 'comment reply is not fund')
        }
        await commentReply.updateOne({$pull:{
            replies:{
                _id:id
            }
        }})
        return successResponse(res,200,'comment reply is reove successFully')
    } catch (error) {
        next(error)
    }
}
exports.getReply = async(req,res, next)=>{
    try {
        
    } catch (error) {
        next(error)
    }
}
exports.update = async(req,res, next)=>{
    try {
        const {id} = req.params
        const user = req.user._id
        console.log(user);
        
        if (!isValidObjectId(id)) {
            return errorResponse(res,400, 'id product is not valid')
            
        }
        const {content, score} = req.body
        await createCommentSchema.validate(req.body, {abortEarly:false})
        const comment = await commentModel.findOne({_id:id})
        if (!comment) {
            return errorResponse(res,404, 'comment is not found')
        }
        if (!comment.user.equals(user)) {
            return errorResponse(res,403, 'you dont have access to update comment')
            
        }
        await comment.updateOne({content, score})
        return successResponse(res,200, 'comment update successFully')
    } catch (error) {
        next(error)
    }
}
exports.delete = async(req,res, next)=>{
    try {
        const {id} = req.params
        if (!isValidObjectId(id)) {
            return errorResponse(res,400, 'id product is not valid')
            
        }
        const comment = await commentModel.findOneAndDelete({_id:id})
        if (!comment) {
            return errorResponse(res,404, 'comment is not defind')
        }
        await comment.deleteOne()
        return successResponse(res,200, 'comment remove successFully')
    } catch (error) {
        next(error)
    }
}
