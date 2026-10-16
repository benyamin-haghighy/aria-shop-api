const yup = require('yup')

const sellerSchema = yup.object().shape({
    name:yup.string().required('name is required'),
    contactDetails:yup.object().shape({
        phone:yup.string().matches(/^09[0-9]{9}$/, 'invalid phone number').required('phone is required')
    }),
    cityId:yup.number().required('cityId is required'),
    user_id:yup.string().required('user_id is required'),
})

module.exports = sellerSchema