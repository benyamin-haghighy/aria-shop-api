const { ExtractJwt } = require('passport-jwt')
const configApp = require('../../config.app')
const userModel = require('../module/auth/v1/auth.model')
const tokenStrategy = require('passport-jwt').Strategy

module.exports = new tokenStrategy({
    jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey:configApp.accessToken.secret
},async(paload,don)=>{
    const user = await userModel.findOne({_id:paload.id})
    if (user.role.includes('ADMIN')) {
        return don(null, user)
    }
    return don(null, false)
})