const express = require('express')
const controller = require('./category.controller')
const passport = require('passport')
const { nanoid } = require('nanoid')
const multer = require('multer')
const path = require('path')
const router = express.Router()
const uploader = (address,mimeType= /^image\/(jpeg|jpg|png|webp|gif)$/)=>{
    let fileName = String(Math.random() * 9000000)
    const storage = multer.diskStorage({
        filename:(req,file,cb)=>{
            cb(null, fileName+path.extname(file.originalname))
        },
        destination:(req,file,cb)=>{
            cb(null, address)
        }
    })
    const upload = multer({storage, limits:{fileSize:50 * 1024 * 1024 },fileFilter:(req,file,cb)=>{
        if (!mimeType.test(file.mimetype)) {
            return cb(null, false)
        }
        return cb(null, true)
    }})
    return upload
}


router.route('/')
    .get(controller.getAll)
    .post(passport.authenticate('adminUser',{session:false}),uploader(path.resolve(__dirname,'../', '../', 'public', 'icon')).single('icon'),controller.create)
router.route('/:id')
    .delete(passport.authenticate('adminUser',{session:false}),controller.delet)
    .put(passport.authenticate('adminUser',{session:false}),uploader(path.resolve(__dirname,'../', '../', 'public', 'icon')).single('icon'),controller.update)
router.route('/:id/subcategory')
    .post(passport.authenticate('adminUser',{session:false}),controller.createSub)

router.route('/subcategory')
    .get(controller.getAllSub)
router.route('/subcategory/:id')
    .get(controller.getSub)
    .put(passport.authenticate('adminUser',{session:false}),controller.updateSub)
module.exports = router