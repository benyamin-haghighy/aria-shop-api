const { ExtractJwt } = require('passport-jwt');
const configApp = require('../../config.app');
const jwt = require('jsonwebtoken');
const userModel = require('../module/auth/v1/auth.model');
const banModel = require('../module/ban/v1/ban.model');
const { successResponse } = require('../helper/reponses');
const jwtStrategy = require('passport-jwt').Strategy;
module.exports = new jwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: configApp.accessToken.secret,
    passReqToCallback: true
},async(req,payload,don)=>{
    const user = await userModel.findOne({_id:payload.id})
    if (!user) {
        return don(null,false)
    }
    const isBan = await banModel.findOne({phone:user.phone})
    if (isBan) {
        return don(null,false)
    }
    return don(null,user)
})