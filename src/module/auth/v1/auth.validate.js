const yup = require('yup')

exports.otpRegisterValidate = yup.object({
    phone:yup.string().required('phone is required').matches(/^(\+98|0)?9\d{9}$/)
})
exports.otpLoginValidate = yup.object({
    phone:yup.string().required('phone is required').matches(/^(\+98|0)?9\d{9}$/),
    code:yup.string().required('otp code is required').matches(/^[0-9]{5,6}$/, 'otp code is not valid')
})

