const express = require('express')
const controller = require('./checkout.controller')
const passport = require('passport')
const router = express.Router()


router.route('/').post(passport.authenticate('accessToken',{session:false}),controller.create)
router.route('/verify').get(controller.verify)



module.exports = router
