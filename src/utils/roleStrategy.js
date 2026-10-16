const { ExtractJwt } = require('passport-jwt')
const path = require('path')
const userModel = require('../module/auth/v1/auth.model')
require('dotenv').config({path:path.join(__dirname, '../../','.env')})
const strategy = require('passport-jwt').Strategy

module.exports = (role)=>{
    return new strategy({
        jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey:process.env.ACCESSTOKEN_SECRET_KEY,
    },async(payload, don)=>{
        try {
            const {id} = payload
            const user = await userModel.findOne({_id:id})
            if (!user) {
                return don(null, false)
            }
            const result = user.role.some(r => {
                return role.includes(r)
            })
            if (!result) {
                return don(null, false)
            }
            return don(null, user)
        } catch (error) {
            next(error)
        }
    })
}