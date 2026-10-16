const { errorResponse } = require('../helper/reponses')
const logger = require('../utils/logger')
module.exports = (er, req,res,next)=>{
    if (er.name === 'ValidationError') {
        logger.error(er)
        return errorResponse(res,400, {message:er.message})
    }
    logger.error(er)
    return errorResponse(res,500, {
        message:er.message,
    })
}