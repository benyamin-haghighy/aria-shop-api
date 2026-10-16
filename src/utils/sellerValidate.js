const { ExtractJwt } = require('passport-jwt')
const config = require('../../config.app')
const accessTokenStrategy = require('passport-jwt').Strategy
const userModel =require('../module/auth/v1/auth.model')
module.exports = new accessTokenStrategy({
    jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey:config.accessToken.secret
},async(payload, don)=>{
    console.log(payload);
    
    const user = await userModel.findOne({_id:payload.id})
    console.log(user);
    
    if (!user) {
        return don(null, false)
    }
    if (!user.role.includes('SELLER')) {
        return don(null,false)
    }
    return don(null, user)
})