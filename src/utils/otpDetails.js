const redis = require('../../redis')
const {errorResponse} =require('../helper/reponses')
module.exports = async(phone)=>{
    const otpCode = await redis.get(`otp:${phone}`)
    if (!otpCode) {
        return {
            expire:true,
            timeRemaining:''
        }
    }
    const time = await redis.ttl(`otp:${phone}`)
    const minute = Math.floor(time/60)
    const second = time % 60
    return {
        expire:false,
        timeRemaining:`${minute.toLocaleString().padStart(2,'0')}:${second.toLocaleString().padStart(2,'0')}`
    }
}