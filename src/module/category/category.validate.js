const yup =require('yup')

module.exports = yup.object().shape({
            title:yup.string().required(' title is reuired'),
            slug:yup.string().required('slug is reuired'),
            descryption:yup.string().optional('descryption is reuired'),
            filters:yup.array().optional().of(yup.object().shape({
                    name:yup.string().required(' title is reuired'),
                    slug:yup.string().required('slug is reuired'),
                    descryption:yup.string().optional('descryption is reuired'),
                    type:yup.string().oneOf(['radio', 'checkbox']).required(' type is reuired'),
                    option:yup.array().of(yup.string()).optional()
            }))
        })