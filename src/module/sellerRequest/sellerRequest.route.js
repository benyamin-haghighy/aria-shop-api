const express = require('express')
const controller = require('./sellerRequest.controller')
const passport = require('passport')
const router = express.Router()
router.route('/')
    .post(passport.authenticate('accessToken', {session:false}), controller.create)
    .get(passport.authenticate('accessToken', {session:false}), controller.getAll)

router.route('/:id')
    .delete(passport.authenticate('accessToken', {session:false}), controller.delete)
    .patch(passport.authenticate('adminUser', {session:false}), controller.update)
module.exports = router