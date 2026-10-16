const { successResponse, errorResponse } = require('../../../helper/reponses')
const userModel = require('../../auth/v1/auth.model')
const cities = require('../../../cities/cities.json')
exports.address = async(req,res,next)=>{
    try {
        // return res.send(cities)
        let {address} = req.body
        const user= req.user
        
        if (!Array.isArray(address)) {
            address = Array(address)
        }
        console.log(address);
        
        const city = cities.find(city=>{
            
            if (city.id === +address[0]['cityId']) {
                return true
            }
        })
        
        if (!city) {
            return errorResponse(res,400,'cityId is not vallid')
        }
        const newUser = await userModel.findOneAndUpdate({phone:user.phone},{
            $push:{
                address
            }
        },{new:true})
        console.log(newUser);
        return successResponse(res,201,'user is update successFully')
        
    } catch (error) {
        
    }
}

exports.deleteAddress = async(req,res,next)=>{
    try {
        const user = req.user
        const addressId = req.params.addressId
        const isDelete = await userModel.findOneAndUpdate({
            _id:user._id,
            'address._id':addressId
        },{
            $pull:{
                address:{
                    _id:addressId
                }
            }
        })
        if (!isDelete) {
            return errorResponse(res,404,'address is not found')
        }
        return successResponse(res,200,'address is remove')
    } catch (error) {
        next(error)
    }
}

exports.updateAddress = async(req,res,next)=>{
    try {
        const addressId = req.params.addressId
        const {
            name,
            postalCode,
            address,
            cityId
        } = req.body.address
        
        const newAddress = await userModel.findOneAndUpdate({
            _id:req.user._id,
            'address._id':addressId
        },{
            $set:{
                    'address.$.name': name,
                    'address.$.postalCode': postalCode,
                    'address.$.address': address,
                    'address.$.cityId': cityId
            }
        },{new:true})
        if (newAddress) {
            console.log(newAddress);
            
            return successResponse(res,200,'address update successFully')
        }
        return errorResponse(res,404,'address is not found')
    } catch (error) {
        next(error)
    }
}

exports.getAll = async(req,res,next)=>{
    try {
            const {page=1, limit=10} = req.query
            console.log(page);
            
            const user = req.user
            const countUsers = await userModel.countDocuments()
            const users = await userModel.find({}).skip((page-1) * limit).limit(limit)
            return res.status(200).json({
                pagination:{
                    allUsers:countUsers,
                    countPage:Math.ceil(countUsers/limit),
                    page,
                },
                users
            })
    } catch (error) {
        next(error)
    }
}