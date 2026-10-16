const { isValidObjectId } = require('mongoose')
const noteModel = require('./note.model')
const { errorResponse, successResponse } = require('../../helper/reponses')
const productModel = require('../product/product.model')
exports.createOrUpdate = async(req,res,next)=>{
    try {
        const {product, content} = req.body
        const user = req.user.id
        const isProduct = await productModel.findById(product)
        if (!isProduct) {
            return errorResponse(res,400, 'product for create or update this note is not found')
        }
        if (!(isValidObjectId(user) && isValidObjectId(product))) {
            errorResponse(res,400, {
                message:"user or product is not valid"
            })
        }
        let note = await noteModel.findOne({user, product})
        if (note) {
            note = await noteModel.findOneAndUpdate({user, product}, {content},{new:true})
            return successResponse(res, 200, {message:"note update successFully",note})

        }else{
            note = await noteModel.create({user,product,content})
        }
        return successResponse(res, 201, {message:"note create successFully",note})
    } catch (error) {
        next(error)
    }
}
exports.getOne = async(req,res,next)=>{
    try {
        const {id} = req.params
        const user= req.user
        if (!isValidObjectId(id)) {
            errorResponse(res,400, {message:"id is not valid"})
        }
        const note = await noteModel.findOne({_id:id,user:user._id}).populate({
            path:'product',
            populate:{
                path:"subCategory",
                select:"title"
            }
        }).populate({path:'user', select:"phone"}).lean()
        if (!note) {
            return errorResponse(res,404, {message:"note with this id is not found or not has access to get"})
        }
        if (note.product === null) {
            await noteModel.deleteOne({_id:note._id})
            return errorResponse(res,409, {message:"note is not valid because the product is remove"})
        }
        return successResponse(res,200, {note})
    } catch (error) {
        next(error)
    }
}
exports.getAll = async(req,res,next)=>{
    try {
        const user = req.user
        const {page, limit=10} = req.query
        const notes = await noteModel.find({user:user._id}).populate('product').populate('user').sort({_id:-1}).skip((page-1) * limit).limit(limit).lean()
        if (!notes) {
            return errorResponse(res,404, {message:"note is not found for this user"})
        }
    return successResponse(res,200, {notes, pageNation:{
        page,
        limit,
        countNotes:notes.length,
        havePage:`with this limit - > ${limit} we can have ${Math.floor(notes.length / limit)===0?1:Math.floor(notes.length / limit)} pages`
    }}) 
    } catch (error) {
        next(error)
    }
}
exports.del = async(req,res,next)=>{
    try {
        const {id} = req.params
        const user = req.user
        const note = await noteModel.findOne({_id:id})
        if (!note) {
            return errorResponse(res,404,'note is not found')
        }
        
        if (!note.user.equals(user._id)) {
            return errorResponse(res,403, {message:"user is not have access to this note"})
        }
        await noteModel.deleteOne({_id:note._id})
        successResponse(res,200, {message:"note remove successFullt", note})
    } catch (error) {
        next(error)
    }
}
exports.update = async(req,res,next)=>{
    try {
       const user = req.user
       const {id} = req.params
       const {content} = req.body 
       let note = await noteModel.findOne({_id:id, user:user._id})
       if (!note) {
        return errorResponse(res,404, 'note is not found or user is not have access to note')
       }
       note = await noteModel.findOneAndUpdate({_id:note._id}, {content},{new:true})
       return successResponse(res,200, {message:"note update successFully", note})
    } catch (error) {
        next(error)
    }
}