const banModel = require('../../ban/v1/ban.model')
const {errorResponse,successResponse} = require('../../../helper/reponses')
const otpDetails = require('../../../utils/otpDetails')
const otpCodeValidate = require('../../../utils/otpCodeValidate')
const otpGenerate = require('../../../utils/otpGenerate')
const tokenGenerate = require('../../../utils/tokenGenerate')
const otpSend = require('../../../service/sendSMS')
const {otpLoginValidate, otpRegisterValidate} = require('./auth.validate')
const userModel= require('./auth.model')

exports.send = async(req,res,next)=>{
    try {
        const {phone} = req.body
        const isBan = await banModel.findOne({phone})
        if (isBan) {
            return errorResponse(res,403,'this phone number has been ban')
        }
        await otpRegisterValidate.validate({phone},{abortEarly:false})
        const {expire, timeRemaining} = await otpDetails(phone)
        if (!expire) {
            return successResponse(res,200,`otp code already sent,pleas try again ${timeRemaining}`)
        }
        const code = await otpGenerate(phone)
        await otpSend(phone, code)

        return successResponse(res,200,'otp send successFully')

    } catch (error) {
        console.log('salam');
        
        next(error)
    }
}

exports.verify = async(req,res,next)=>{
    try {
        const {phone,code,isSeller} = req.body
        await otpLoginValidate.validate({phone,code},{abortEarly:true})
        const {expire} = await otpDetails(phone)
        if (expire) {
            return errorResponse(res,400,'this code is expire')
        }
        const {equal} = await otpCodeValidate(phone,code)
        if (!equal) {
            return errorResponse(res,400,'code is not valid')
        }
        let user = await userModel.findOne({phone})
        if (user) {
            const {accessToken,refreshToken} = tokenGenerate(user)
            return successResponse(res,200,{accessToken,refreshToken})
        }
        let role = []
        if (isSeller) {
            role.push('SELLER')
        }
        const countUser = await userModel.countDocuments()
        if (countUser === 0) {
            role.push('ADMIN')
        } else {
            role.push('USER')
        }
        await userModel.create({
            phone,
            role: role
        })
        user = await userModel.findOne({phone})
        const {accessToken,refreshToken} = tokenGenerate(user)
        return successResponse(res,201,{message:"user is create",accessToken,refreshToken})
    } catch (error) {
        next(error)
    }
}

exports.me = async(req,res,next)=>{
    try {
        const user = req.user
        return successResponse(res,200,user)
    } catch (error) {
        
    }
}

