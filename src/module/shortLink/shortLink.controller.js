const { errorResponse } = require("../../helper/reponses")
const productModel = require("../product/product.model")

exports.get = async(req,res,next)=>{
    try {
        const {shortIdentifire} = req.params
        const product = await productModel.findOne({shortUrl:shortIdentifire})
        if (!product) {
            errorResponse(res,404, 'product is not found')
        }
        return res.redirect(`/product/${product.slug}`)
    } catch (error) {
        next(error)
    }
}