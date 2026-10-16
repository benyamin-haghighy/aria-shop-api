const express = require('express')
const controller = require('./auth.controller')
const passport = require('passport')
const router = express.Router()


router.post('/send',controller.send)
router.post('/verify',controller.verify)
router.get('/me',passport.authenticate('accessToken',{session:false}),controller.me)


module.exports = router
