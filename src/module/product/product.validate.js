const { isValidObjectId } = require('mongoose');
const yup = require('yup');
exports.productSchema = yup.object({
    name: yup
        .string()
        .trim()
        .required('نام محصول الزامی است'),

    slug: yup
        .string()
        .trim()
        .required('اسلاگ محصول الزامی است'),

    subCategory: yup
        .string()
        .test('valid-subCategory','subCategory is not valid',value => isValidObjectId(value))
        .required('زیردسته الزامی است'),

    descryption: yup
        .string()
        .trim()
        .required('توضیحات محصول الزامی است'),

    seller: yup
        .array()
        .optional()
        .of(
            yup.object({
                seller: yup
                    .string()
                    .matches(/^[0-9a-fA-F]{24}$/, 'شناسه فروشنده معتبر نیست')
                    .required('شناسه فروشنده الزامی است'),

                price: yup
                    .number()
                    .typeError('قیمت باید عدد باشد')
                    .min(0, 'قیمت نمی‌تواند منفی باشد')
                    .required('قیمت الزامی است'),

                stock: yup
                    .number()
                    .typeError('موجودی باید عدد باشد')
                    .integer('موجودی باید عدد صحیح باشد')
                    .min(0, 'موجودی نمی‌تواند منفی باشد')
                    .required('موجودی الزامی است')
            })
        )
        .default([]),

    filterValue: yup
        .object()
        .required('مقادیر فیلتر الزامی است'),

    customFilter: yup
        .object()
        .test(
            'string-values',
            'مقادیر فیلتر سفارشی باید رشته باشند',
            value =>
                !value ||
                Object.values(value).every(
                    item => typeof item === 'string'
                )
        )
        .default({})
})
exports.productUpdateSchema = yup.object({
    name: yup
        .string()
        .trim()
        .required('نام محصول الزامی است')
        .min(3, 'نام محصول باید حداقل ۳ کاراکتر باشد'),

    newslug: yup
        .string()
        .trim()
        .required('اسلاگ الزامی است'),

    subCategory: yup
        .string()
        .required('زیردسته الزامی است'),

    descryption: yup
        .string()
        .trim()
        .required('توضیحات محصول الزامی است'),


    newSeller: yup
        .array()
        .optional()
        .of(
            yup.object({
                seller: yup
                    .string()
                    .matches(/^[0-9a-fA-F]{24}$/, 'شناسه فروشنده معتبر نیست')
                    .required('شناسه فروشنده الزامی است'),

                price: yup
                    .number()
                    .typeError('قیمت باید عدد باشد')
                    .required('قیمت الزامی است')
                    .min(0, 'قیمت نمی‌تواند منفی باشد'),

                stock: yup
                    .number()
                    .typeError('موجودی باید عدد باشد')
                    .integer('موجودی باید عدد صحیح باشد')
                    .required('موجودی الزامی است')
                    .min(0, 'موجودی نمی‌تواند منفی باشد')
            })
        ).default([]),

    filterValue: yup
        .object()
        .required('مقادیر فیلتر الزامی است'),

    customFilter: yup
        .object()
        .test(
            'string-values',
            'مقادیر فیلتر سفارشی باید رشته باشند',
            value =>
                value == null ||
                Object.values(value).every(item => typeof item === 'string')
        )
})