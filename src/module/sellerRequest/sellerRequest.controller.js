const { errorResponse, successResponse } = require('../../helper/reponses')
const productModel = require('../product/product.model')
const sellerModel = require('../seller/seller.model')
const sellerRequestModel = require('./sellerRequest.model')
const {sellerRequestSchema} = require('./sellerRequest.validate')
exports.create = async(req,res,next)=>{
    try {
        const user = req.user
        const {
            product,
            price,
            stock
        } =req.body
        await sellerRequestSchema.validate(
            {
                seller:user._id,
                product,
                price:Number(price),
                stock:Number(stock)
            }
        )
        const Seller = await sellerModel.findOne({user_id:user._id})
        if (!Seller) {
            return errorResponse(res,404, 'seller is not found')
        }
        let request = await sellerRequestModel.findOne({seller:Seller._id, product})
        if (request) {
            return errorResponse(res,400, 'request with product is exist')
        }
        const isproduct = await productModel.findOne({_id:product})
        if (!isproduct) {
            return errorResponse(res,404, 'peroduct is not found')
        }
        request = await sellerRequestModel.create({seller:Seller._id, product, price:Number(price),stock:Number(stock)})
        return successResponse(res,201,{
            message:"request is create successFlly",
            request
        })
    } catch (error) {
        next(error)
    }
}
exports.getAll = async(req,res,next)=>{
    try {
        const {status='pending',page, limit} = req.query
        const user = req.user
        const seller = await sellerModel.findOne({
            user_id:user._id
        })
        if (!seller) {
            return errorResponse(res,404, {message:"cant found the seller for this user"})
        }
        const requests = await sellerRequestModel.find({seller:seller._id, status}).sort({_id:'desc'}).skip((page-1) * limit).limit(limit)
        if (!requests) {
            return errorResponse(res, 400, 'ypu dont have  request')
        }
        return successResponse(res, 200, {
            pageNation:{
                page,
                limit,
                countPageWithLimit:Math.floor(requests.length/limit) <= 0 ? 1 : Math.floor(requests.length/limit),
                countRequest:requests.length
            },
            requests
        })
    } catch (error) {
        next(error)
    }
}
exports.delete = async(req,res,next)=>{
    try {
        const {id} = req.params
        const user = req.user
        const seller = await sellerModel.findOne({user_id:user._id})
        if (!seller) {
            return errorResponse(res,404, 'seller is not found for this user')
        }
        let request = await sellerRequestModel.findOne({_id:id, seller:seller._id})
        if (!request) {
            return errorResponse(res,404, 'request is not found ')
        }
        if (request.status !== 'pending') {
            return errorResponse(res,403, 'you cant have acess to remove request because the request is accept')
        }
        request = await sellerRequestModel.findOneAndDelete({_id:id})
        return successResponse(res,200, {message:"request is remove successFully", request})
    } catch (error) {
        next(error)
    }
}
exports.update = async(req,res,next)=>{
    try {
        const {id} = req.params
        const {status, statusComment} = req.body
        
        let request = await sellerRequestModel.findOne({_id:id})
        if (!request) {
            return errorResponse(res,404, 'the requesst is not found')
        }
        
        if (status === 'accepted') {
            const product = await productModel.findOne({_id:request.product})
            if (!product) {
                return errorResponse(res, 404, ' product for this request is not exist')
            }
            const seller = await sellerModel.findOne({_id:request.seller})
            if (!seller) {
                return errorResponse(res,404, 'seller for this request is not exist')
            }
            productSeller = product.seller.find(s => {
                console.log(s.seller);
                console.log(seller._id);
                
                return s.seller.equals(seller._id)
            });

            if (productSeller) {
                return errorResponse(res,400,'already exist seller in product')
            }
            
            await product.updateOne({seller:{seller:seller._id, price:request.price, stock:request.stock}})
            
        }
        request = await sellerRequestModel.findOneAndUpdate({_id:id}, {$set:{
            status,
            stateComment: statusComment?statusComment:request.stateComment
        }}, {new:true,runValidators:true})
        return successResponse(res,200, {message:"the request update successFully",request})
        
    } catch (error) {
        
        next(error)
    }
}