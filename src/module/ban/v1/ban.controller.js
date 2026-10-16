const banModel = require('./ban.model')
const {errorResponse,successResponse} = require('../../../helper/reponses')
const userModel = require("../../auth/v1/auth.model")
exports.banUser = async(req,res,next)=>{
    try {
        const {phone} = req.params
        const user= req.user
        const userBan = await userModel.findOne({phone})
        console.log(userBan);

        if (!userBan) {
            return errorResponse(res,404,"User not found or banned")
        }
        if (userBan.role.includes('ADMIN')) {
            return errorResponse(res,403,"You can't ban an admin user")
        }
        await banModel.create({phone})
        await userModel.deleteOne({phone})
        return successResponse(res,200,"User banned successfully")
    } catch (error) {
        next(error)
    }
}