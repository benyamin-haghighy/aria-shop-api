const redis = require('../../redis')
module.exports = async(phone)=>{
    const code = Math.floor(Math.random()*1000000)
    await redis.set(`otp:${phone}`, code, 'EX', 300)
    return code
}