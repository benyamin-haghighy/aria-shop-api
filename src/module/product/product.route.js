const express = require('express')
const path = require('path')

const multer = require('multer')
const passport = require('passport')
const controller = require('./product.controller')
const { nanoid } = require('nanoid')
const router = express.Router()

const uploader = (address, mimeType=/^image\/(jpeg|png|jpg|webp|gif)$/)=>{
    
    const storage = multer.diskStorage({
        filename:(req,file,cb)=>{
            cb(null, nanoid(12) + `${path.extname(file.originalname)}`)
        },
        destination:(req,file,cb)=>{
            cb(null, address)
        }
    })
    const upload = multer({storage, limits:{
        fileSize:30 * 10000
    },fileFilter:(req,file,cb)=>{
        if (mimeType.test(file.mimetype)) {
            return cb(null, true)
        }
        return cb(null,false)
    }})
    return upload
}


router.route('/')
    .post(passport.authenticate('adminUser',{session:false}), uploader(path.resolve(__dirname, '../../', 'public', 'images', 'products')).array('images', 10), controller.create)
    .get(controller.getAll)
router.route('/:slug/images')
    .delete(passport.authenticate('adminUser',{session:false}), controller.deleteImage)
router.route('/:slug')
    .delete(passport.authenticate('adminUser',{session:false}), controller.del)
    .put(passport.authenticate('adminUser',{session:false}),uploader(path.resolve(__dirname, '../../', 'public', 'images', 'products')).array('images', 10),controller.update)
    .get(controller.getOne)   
module.exports = router