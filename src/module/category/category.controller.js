const categoryModel = require('./category.model')
const subCategoryModel = require('./categorySub.model')
const categorySchema = require('./category.validate')
const fs = require('fs')
const path = require('path')
const { successResponse, errorResponse } = require('../../helper/reponses')

exports.getAll = async(req,res,next)=>{
    try {
        let categories = await categoryModel.find({parent:{$eq:null}},'-__v -createdAt -updatedAt')
        let newCategories = await Promise.all(categories.map(async(category) =>{
            console.log(category._id);
            
            const subCategories = await categoryModel.find({parent:category._id},'-__v -createdAt -updatedAt')
            return {
                category,
                subCategories: subCategories ? subCategories : 'this category is not have subCategroy'
            } 
        }))
        let resultCategryies = []
        resultCategryies = await Promise.all(newCategories.map(async(cg) => {
            let resultSubCategryies = []
             resultSubCategryies = await Promise.all(cg.subCategories.map(async(c)=>{
                    const result = await subCategoryModel.find({parent:c._id},'title')
                    console.log(c);
                    console.log(result);
                    
                    return {title:c.title,subCategories:result}
                    
                    
             }))
             return {
                    category:cg.category.title,
                    subCategories:resultSubCategryies
                }
             
        }))
        return res.json({categories:resultCategryies})
        
        
    } catch (error) {
        next(error)
    }
}

exports.create = async(req,res,next)=>{
    try {
        
        const {
            title,
            slug,
            descryption,
            parent=null,
            filters=null
        } = req.body
        console.log(req.body);
        
        await categorySchema.validate(req.body,{abortEarly:false})
        if (!req.file && !parent) {
            return errorResponse(res, 400, 'icon is required')
        }
        const icon = parent
            ? null
            : {
                fileName: req.file.filename,
                path: `/public/icon/${req.file.filename}`
            }
        const category = await categoryModel.create({
            title,
            slug,
            parent,
            descryption,
            icon,
            filters
        })
        return successResponse(res,201,{
            message:"category is create successFully",
            category
        })
    } catch (error) {
        next(error)
    }
}

exports.createSub = async(req,res,next)=>{
    try {
        const categoryId = req.params.id
        const {
            title,
            slug,
            descryption,
            filters=null
        } = req.body
        categorySchema.validate(req.body,{abortEarly:false})
        const category =await categoryModel.findOne({_id:categoryId})
        if (!category) {
            return errorResponse(res,400,{message:"parent is not found"})
        }
        const subcategory = await subCategoryModel.create({
            title,
            slug,
            descryption,
            filters,
            parent:category._id
        })
        return successResponse(res,201,{message:"subcategory is create",subcategory})

    } catch (error) {
        next(error)
    }
}

exports.delet = async(req,res,next)=>{
    try {
        const categoryId = req.params.id
        const subCategory = await subCategoryModel.findOne({_id:categoryId})
        if (subCategory) {
            await subCategoryModel.deleteOne({_id:categoryId})
            if (subCategory.icon) {
                fs.rm(path.join(__dirname,'../','../',subCategory.icon.path), (err) => {
    if (err) {
        console.log(err)
    }
})
            }
            return successResponse(res,200,{
                message:"category is remove successFully",
                subCategory
            })

        }
        const category = await categoryModel.findOne({_id:categoryId})
        if (!category) {
            return errorResponse(res,404,{message:"category is ot found"})
        }
        await categoryModel.deleteOne({_id:categoryId})
        if (category.icon) {
                console.log(path.join(__dirname,'../','../',category.icon.path))
                
                fs.rm(path.join(__dirname,'../','../',category.icon.path), (err) => {
    if (err) {
        console.log(err)
    }
})
            }
        return successResponse(res,200, {
                message:"category is remove successFully",
                category
            })
    } catch (error) {
        next(error)
    }
}

exports.update = async(req,res,next)=>{
    try {
        const categoryId = req.params.id
        
        const {
            title,
            slug,
            descryption,
            parent=null,
            filters=null
        } = req.body
        await categorySchema.validate(req.body,{abortEarly:false})
        let icon = null
        if (req.file) {
            icon={
                fileName:req.file.filename,
                path:path.join('/public/icon', req.file.filename)
            }
        }
        let category = await categoryModel.findOne({_id:categoryId})
        console.log(category);
        
        if (!category) {
            return errorResponse(res,404, {message:"category  is not found"})
        }
        category = await categoryModel.findOneAndUpdate({_id:categoryId},{
            $set:{
                title,
                slug,
                descryption,
                parent,
                filters,
                icon
            }
         },{new:true})
         return successResponse(res,200,{
            message:"update category is successFully",
            category
         })
    } catch (error) {
        next(error)
    }
}


exports.getAllSub = async(req,res,next)=>{
    try {
        const categories = await subCategoryModel.find({},'-__v -createdAt -updatedAt').populate('parent', 'title')
        return successResponse(res,200,{
            categories
        })
    } catch (error) {
        next(error)
    }
}

exports.getSub = async(req,res,next)=>{
    try {
        const categoryId = req.params.id
        const category = await subCategoryModel.findOne({_id:categoryId},'-__v -createdAt -updatedAt').populate('parent', 'title')
        if (!category) {
            return errorResponse(res,404,{message:"category is not found"})
        }
        return successResponse(res,200,{category})
    } catch (error) {
        next(error)
    }
}

exports.updateSub = async(req,res,next)=>{
    try {
        const categoryId = req.params.id
        let {
            title,
            slug,
            descryption,
            parent,
            filters=null
        } = req.body
        await categorySchema.validate(req.body,{abortEarly:false})
        parent = await categoryModel.findById(parent)
        if (!parent) {
            return errorResponse(res,400, 'parent category is not exist')
        }
        const category = await subCategoryModel.findOneAndUpdate({_id:categoryId},{$set:{
            title,
            slug,
            descryption,
            parent,
            filters
        }},{new:true})
        if (!category) {
            return errorResponse(res,404,{message:"category is no found for update"})
        }
        return successResponse(res,200,{
            message:"category update successFully",
            category
        })
    } catch (error) {
        next(error)
    }
}