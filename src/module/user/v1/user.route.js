const express = require('express')
const controller = require('./user.controller')
const passport = require('passport')
const router = express.Router()
router.route('/')
    .get(passport.authenticate('adminUser', {session:false}), controller.getAll)
router.route('/address')
    .put(passport.authenticate('accessToken',{session:false}),controller.address)

router.route('/address/:addressId')
    .delete(passport.authenticate('accessToken',{session:false}),controller.deleteAddress)
    .patch(passport.authenticate('accessToken',{session:false}), controller.updateAddress)
module.exports = router