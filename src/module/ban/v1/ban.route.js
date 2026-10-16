const express = require('express')
const controller = require('./ban.controller')
const passport = require('passport')
const router = express.Router()

router.route('/:phone').post(passport.authenticate('adminUser',{session:false}),controller.banUser)

module.exports = router
