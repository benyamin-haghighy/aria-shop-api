const express = require('express')
const controller = require('./seller.controller')
const passport = require('passport')
const router = express.Router()

router.route('/')
    .get(passport.authenticate('sellerUser', {session:false}), controller.get)
    .post(passport.authenticate('sellerUser',{session:false}),controller.create)
router.route('/:id')
    .delete(passport.authenticate('sellerUser', {session:false}),controller.delet)
    .patch(passport.authenticate('sellerUser', {session:false}),controller.update)
module.exports = router