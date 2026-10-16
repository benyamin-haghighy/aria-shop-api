const redis = require('../../redis')

module.exports = async(phone,code)=>{
    const isCode = await redis.get(`otp:${phone}`)
    if (Number(isCode)!==Number(code)) {
        return {
            equal:false
        }
    }
    return {
        equal:true
    }
}