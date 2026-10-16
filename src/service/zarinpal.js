const axios = require('axios')
const path = require('path')
require('dotenv').config({path:path.join(__dirname, '../../','.env')})
exports.createPayment = async({amount,description='', mobile})=>{
    try {
        const response = await axios.post(process.env.ZARINPAL_BASE_URL,{
            merchant_id:process.env.ZARINPAL_MERCHANT,
            amount,
            description,
            callback_url:process.env.ZARINPAL_CALLBACK_URL,
            metadata:{
                mobile
            }
        },{
            headers:{
                "Content-Type":"application/json"
            }
        })
        return {
            authority:response.data.data.authority,
            pamentUrl:process.env.ZARINPAL_PAYMENT_URL+response.data.data.authority
        }
        
    } catch (error) {
        throw error
    }
}

exports.verifyPayment = async({amount, authority})=>{
    try {
        const response = await axios.post(process.env.ZARINPAL_VERIFY_URL,{
            amount,
            authority,
            merchant_id:process.env.ZARINPAL_MERCHANT
        },{headers:{
            "Content-Type":"application/json"
        }})
        console.log(response);
        
        return {code:response.data.data.code, ref_id:response.data.data.ref_id}
    } catch (error) {
        throw error
    }
}