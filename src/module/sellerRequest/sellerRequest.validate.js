const yup = require('yup')

exports.sellerRequestSchema = yup.object({
    seller: yup
        .string()
        .matches(/^[0-9a-fA-F]{24}$/, 'شناسه فروشنده معتبر نیست')
        .required('شناسه فروشنده الزامی است'),

    product: yup
        .string()
        .matches(/^[0-9a-fA-F]{24}$/, 'شناسه محصول معتبر نیست')
        .required('شناسه محصول الزامی است'),

    price: yup
        .number()
        .typeError('قیمت باید عدد باشد')
        .required('قیمت الزامی است')
        .min(0, 'قیمت نمی‌تواند منفی باشد'),

    stock: yup
        .number()
        .typeError('موجودی باید عدد باشد')
        .required('موجودی الزامی است')
        .integer('موجودی باید عدد صحیح باشد')
        .min(0, 'موجودی نمی‌تواند منفی باشد')
})