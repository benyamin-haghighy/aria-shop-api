const userModel = require('../auth/v1/auth.model')
const cityDocuments = require('../../cities/cities.json')
const sellerSchema =require('./seller.validate')
const sellerModel = require('./seller.model')
const { successResponse } = require('../../helper/reponses')
exports.create = async(req,res,next)=>{
    try {
        const {
            name,
            contactDetails,
            cityId
        } = req.body
        const user= req.user
        sellerSchema.validate({...req.body,user_id:user.id},{abortEarly:false})
        const countStore = await sellerModel.countDocuments({user_id:user.id})
        if (countStore > 0) {
            return res.status(403).json({message:"user has aa store"})
        }
        const isCity = cityDocuments.find(city => {
            if (+city.id === +cityId) {
                return true
            }
        }) 
        if (!isCity) {
            return res.status(404).json({message:"city with cityId is not found"})
        }
        const store = await sellerModel.create({
            name,
            contactDetails,
            cityId,
            user_id:user.id
        })
        return res.status(201).json({
            message:"stroe is create",
            store
        })
    } catch (error) {
        next(error)
    }
}

exports.update = async(req,res,next)=>{try {
    const user = req.user
    const {name, contactDetails, cityId} = req.body
    const storeId = req.params.id
    const isSeller = await sellerModel.findOne({_id:storeId, user_id:user.id})
    if (!isSeller) {
        return res.status(403).json({
            message:"user is not access to store"
        })
    }
    const isCtiy = cityDocuments.some(city => {
        if (+city.id === + cityId) {
            return true
        }
    })
    if (!isCtiy) {
        return  successResponse(res,400,'this city is not exist')
    }
    sellerSchema.validate({...req.body, user_id:user.id})
    const store = await sellerModel.findOneAndUpdate({_id:storeId, user_id:user.id}, {
        $set:{
            name,
            contactDetails,
            cityId,
            user_id:user.id
        }
    },{new:true})
    return successResponse(res,200, 'store update successFully')
} catch (error) {
    next(error)
}}

exports.delet = async(req,res,next)=>{try {
    const user = req.user
    const storeId = req.params.id
    const isSeller = await sellerModel.findOne({_id:storeId, user_id:user.id})
    if (!isSeller) {
        return res.status(403).json({
            message:"user is not access to store"
        })
    }
    const store = await sellerModel.findOneAndDelete({_id:storeId}).select('-createdAt -updatedAt').populate('user_id', 'phone')
    return successResponse(res,200,{
        message: 'stroe is remve suucessFully',
        store
    })
} catch (error) {
    next(error)
}}

exports.get = async(req,res,next)=>{
    try {
        const user = req.user
        const isSeller = await sellerModel.findOne({user_id:user.id}).select('-createdAt -updatedAt -user_id -__v')
    if (!isSeller) {
        return res.status(403).json({
            message:"user is not have store"
        })
    }
    return successResponse(res,200,{
        store:isSeller
    })
    } catch (error) {
        next(error)
    }
}