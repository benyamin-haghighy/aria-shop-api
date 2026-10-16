
const successResponse = (res,statusCode, message)=>{
    return res.status(statusCode).json({
        statusCode,
        message

    })
}
const errorResponse = (res,statusCode, message)=>{
    return res.status(statusCode).json({
        statusCode,
        message

    })
}


module.exports = {
    successResponse,
    errorResponse
}