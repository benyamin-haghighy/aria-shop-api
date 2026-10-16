const yup = require('yup')

exports.updateOrderSchema = yup.object().shape({
    status:yup.string().required().oneOf(['PROCESSING', 'SHIPPED', 'DELIVERED']),
    postTrackingCode:yup.string().min(10).max(10),    
})