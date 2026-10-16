
const yup = require('yup');

const createCheckoutSchema = yup.object({
    shippingAddress: yup.object({
        postalCode: yup
            .string()
            .trim()
            .required(),

        cordinates: yup.object({
            lat: yup
                .number()
                .min(-90)
                .max(90)
                .required(),

            lag: yup
                .number()
                .min(-180)
                .max(180)
                .required(),
        }).required(),

        address: yup
            .string()
            .trim()
            .required(),

        cityId: yup
            .number()
            .integer()
            .positive()
            .required(),
    }).required(),
});

module.exports = {
    createCheckoutSchema,
};
