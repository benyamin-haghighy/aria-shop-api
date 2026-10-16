const express = require('express')
const controller = require('./cart.controller')
const passport = require('passport')
const router = express.Router()


router.route('/').get(passport.authenticate('accessToken',{session:false}),controller.get)
router.route('/remove').delete(passport.authenticate('accessToken',{session:false}),controller.remove)
router.route('/add').post(passport.authenticate('accessToken',{session:false}),controller.add)



module.exports = router
