const express = require('express')
const controller = require('./order.controller')
const passport = require('passport')
const router = express.Router()


router.route('/').get(passport.authenticate('roleStrategy',{session:false}),controller.getAllOrders)
router.route('/:id').patch(passport.authenticate('adminUser',{session:false}),controller.updateOrder)



module.exports = router
