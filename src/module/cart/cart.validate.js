
const yup = require('yup');

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const addToCartSchema = yup.object({
    productId: yup
        .string()
        .matches(objectIdRegex, 'productId must be a valid ObjectId')
        .required(),

    sellerId: yup
        .string()
        .matches(objectIdRegex, 'sellerId must be a valid ObjectId')
        .required(),

    quantity: yup
        .number()
        .transform((value, originalValue) =>
            originalValue === '' ? NaN : value
        )
        .typeError('quantity must be a number')
        .integer('quantity must be an integer')
        .min(1, 'quantity must be at least 1')
        .required()
});

const removeFromCartSchema = yup.object({
    productId: yup
        .string()
        .matches(objectIdRegex, 'productId must be a valid ObjectId')
        .required(),

    sellerId: yup
        .string()
        .matches(objectIdRegex, 'sellerId must be a valid ObjectId')
        .required()
});

module.exports = {
    addToCartSchema,
    removeFromCartSchema
};
