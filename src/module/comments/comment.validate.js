const yup = require('yup')

const createCommentSchema = yup.object({
    content: yup
        .string()
        .trim()
        .required('content is required'),

    score: yup
        .number()
        .typeError('score must be a number')
        .integer('score must be an integer')
        .min(1, 'score must be at least 1')
        .max(5, 'score must be at most 5')
        .default(3)
})
const createAplyCommentSchema = yup.object({
    content: yup
        .string()
        .trim()
        .required('content is required')
})
module.exports = { createCommentSchema , createAplyCommentSchema}