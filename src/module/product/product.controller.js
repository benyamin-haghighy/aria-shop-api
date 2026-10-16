const { errorResponse, successResponse } = require('../../helper/reponses')
const productModel = require('./product.model')
const {productSchema, productUpdateSchema} = require('./product.validate')
const path = require('path')
const fs = require('fs')
const noteModel = require('../notes/note.model')
const { default: mongoose } = require('mongoose')

exports.getAll = async(req,res,next)=>{
    try {
        const {
            minPrice=0,
            maxPrice=100_000_000_000,
            name,
            exist,
            filter,
            subCategory,
            seller,
            page=1,
            limit=10
        } = req.query
        const filters = {}
        if (name) {
            filters['name']= {$regex:name}
        }
        if (subCategory) {
            if (!mongoose.Types.ObjectId.isValid(subCategory)) {
              return errorResponse(res, 400, 'Invalid subCategory ID');
            }
            filters['subCategory']=new mongoose.Types.ObjectId(subCategory)
            
        }
        if (seller) {
            if (!mongoose.Types.ObjectId.isValid(seller)) {
              return errorResponse(res, 400, 'Invalid subCategory ID');
            }
            if (exist) {
                if (minPrice || maxPrice) {
                    filters['seller']={$elemMatch:{
                        seller:new mongoose.Types.ObjectId(seller),
                        price:{
                            $lte:+maxPrice,
                            $gte:+minPrice
                        },
                        stock:{$gt:0}
                    }}
                }else{
                    filters['seller'] = {$elemMatch:{
                        seller:new mongoose.Types.ObjectId(seller),
                        stock:{$gt:0}
                    }}
                }
                
            }else{
                filters['seller.seller']=new mongoose.Types.ObjectId(seller)
            }
            
        }else{
            if (exist) {
                filters['seller.stock']={$gt:0}
            }
            if (maxPrice) {
                filters['seller.price'] = {$lte:+maxPrice}
            }
            if (minPrice) {
                filters['seller.price'] = {$gte:+minPrice}

            }
        }
        
        if (filter) {
            for (const key in filter) {
                filters[`filterValue.${key}`]=filter[key]
            }
        }
        const products = await productModel.aggregate([
            {
                $match:filters
            },
            {
                $lookup:{
                    from:"comments",
                    localField:"_id",
                    foreignField:"product",
                    as:"comments"
                }
            },
            {
                $addFields:{
                    avgRatingComment:{$cond:{
                        if:{$gt:[{$size:'$comments'},0]},
                        then:{$avg:'$comments.score'},
                        else:0
                    }}
                }
            },
            {
                $skip:(page-1)*limit
            },
            {
                $limit:+limit
            },
            {
                $project:{
                    comments:0
                }
            }
        ]
        )
        const countProducts = await productModel.aggregate([
            {
                $match:filters
            },
            {
                $count:'count'
            }
        ]
        )
        console.log(countProducts);
        
        return successResponse(res,200, {products,pageNation:{
            countProducts:countProducts[0].count,
            limit,
            page,
            countPage:Math.ceil(countProducts.count/limit)>0?(countProducts.count/limit):1
        }})
    } catch (error) {
     next(error)   
    }
}

exports.create = async(req,res,next)=>{
    try {
        let {
            name,
            slug,
            subCategory,
            descryption,
            seller,
            filterValue,
            customFilter
        } = req.body
            if(seller) seller = JSON.parse(seller)
            filterValue = JSON.parse(filterValue)
            customFilter = JSON.parse(customFilter)       
        await productSchema.validate({
            name,
            slug,
            subCategory,
            descryption,
            seller,
            filterValue,
            customFilter
        },{abortEarly:false})
        let images = []
        for (const file of req.files) {
            if (file) {
                images.push({name:`${file.filename}`})
            }
        }
        if (images.length === 0) {
            images.push({path:`/public/images/products/download.png`})
        }
        let numberShortUrl = Math.ceil(Math.random() * 9999)
        let isCurrectShortUrl = ''
        while(!isCurrectShortUrl){
            const isShort = await productModel.findOne({shortUrl:numberShortUrl})
            if (!isShort) {
                isCurrectShortUrl=true
            }
            numberShortUrl++
        }
        const isProduct = !!(await productModel.findOne({slug, name}))
        if (isProduct) {
            return errorResponse(res,409,'This product already exists')
        }
        const product = await productModel.create({name,
            slug,
            subCategory,
            descryption,
            seller,
            filterValue,
            customFilter,
            images,
            shortUrl:numberShortUrl
    })
    return successResponse(res,201,{
        messsage:"product is create",
        product
    })
    } catch (error) {
        next(error);
    }
}
exports.getOne = async(req,res,next)=>{
    try {
        const {slug} = req.params
        let product = await productModel.findOne({slug:slug}).populate({
            path:'subCategory',
            select:'title parent',
            populate:{
                path:'parent',
                select:'title parent',
                populate:{
                    path:"parent",
                    select:"title"
                }
            }
        }).populate('seller.seller', 'name contactDetails').lean()
        
        if (!product) {
            return errorResponse(res,404,'product is not found')
        }
        product.subSubCategory = product.subCategory
        delete product.subCategory
        product.subSubCategory.subCategory = product.subSubCategory.parent
        delete product.subSubCategory.parent
        if (product.subSubCategory.subCategory.parent===null) {
            delete product.subSubCategory.subCategory.parent
        }else{
            product.subSubCategory.subCategory.category = product.subSubCategory.subCategory.parent
            delete product.subSubCategory.subCategory.parent
        }
        successResponse(res,200, {product})
    } catch (error) {
        
    }
}
exports.deleteImage = async(req,res,next)=>{
    try {
        const {slug}= req.params
        let {images} = req.body
        let product = await productModel.findOne({slug:slug})
        
        if (!product) {
            return errorResponse(res,404,'product is not found')
        }
        product = await productModel.findOneAndUpdate({_id:product._id}, {
            $pull:{
                images: {
                name: {
                    $in: images
                }
            }
            }
        },{new:true})
        
        images.forEach(image => {
            fs.rm(path.join(__dirname, '../../', 'public', 'images', 'products', image),(error)=>{
                if (error) {
                    next(error)
                }
            })
        });
        successResponse(res, 200, {
            message:"images are remove successFully",
            product
        })
    } catch (error) {
        next(error)
        
    }
}
exports.del = async(req,res,next)=>{
    try {
        const {slug} = req.params
        let product = await productModel.findOne({slug:slug})
        if (!product) {
            return errorResponse(res,404,'product is not found')
        }
        product.images.forEach(image=>{
            fs.rm(path.join(__dirname, '../../', 'public', 'images', 'products', image.name),(error)=>{
                if (error) {
                    next(error)
                }
            })
        })
        await noteModel.deleteMany({product:product._id})
        product = await productModel.deleteOne({_id:product._id}) 
        return successResponse(res,200, {
            message:"product is remove successFully",
            product
        })
    } catch (error) {
        next(error)
    }
}
exports.update = async(req,res,next)=>{
    try {
        let {
            name,
            subCategory,
            descryption,
            newSeller,
            newslug,
            filterValue,
            customFilter
        } = req.body
        filterValue = JSON.parse(filterValue)
        customFilter = JSON.parse(customFilter)
        

        await productUpdateSchema.validate({
            name,
            subCategory,
            descryption,
            newslug,
            newSeller,
            filterValue,
            customFilter
        },{abortEarly:false})
        const {slug} = req.params
        let product = await productModel.findOne({slug})
        
        if (!product) {
            return errorResponse(res,404, 'product is not found')
        }
        let images = []
        if (req.files.length > 0) {
            for (const file of req.files) {
                images.push({name:file.filename})
            }
        }
        if (images.length>0) {
            product.images.forEach(image => {
                fs.rm(path.join(__dirname, '../../', 'public', 'images', 'products', `${image.name}`),(error)=>{
                    next(error)
                })
            })
        }
        product = await productModel.findOneAndUpdate({_id:product._id}, {
            name,
            subCategory,
            descryption,
            seller: newSeller ? newSeller : product.seller,
            slug: newslug ?  newslug: slug,
            filterValue,
            customFilter,
            images:images.length>0 ? images : product.images
        },{new:true})
        successResponse(res,200, {
            message:"product update successFully",
            product
        })
    } catch (error) {
        next(error)
    }
}