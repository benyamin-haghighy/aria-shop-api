const cities = require('../../cities/cities.json')
const provinces = require('../../cities/provinces.json')
const { successResponse } = require('../../helper/reponses')
exports.getAllCtiy = async(req,res,next)=>{
    try {
        return successResponse(res,200, cities)
    } catch (error) {
        next(error)
    }
}

exports.getAllProvinces = async(req,res,next)=>{
    try {
        return successResponse(res,200, provinces)
    } catch (error) {
        next(error)
    }
}