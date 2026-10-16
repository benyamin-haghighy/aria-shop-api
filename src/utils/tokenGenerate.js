const jwt = require('jsonwebtoken')
const config = require('../../config.app')
module.exports = (user)=>{
    const accessToken = jwt.sign({id:user._id, phone:user.phone}, config.accessToken.secret,{
        expiresIn:+config.accessToken.expire
    })
    const refreshToken = jwt.sign({id:user._id, phone:user.phone}, config.refreshToken.secret,{
        expiresIn:+config.refreshToken.expire
    })
    return {accessToken, refreshToken}
}