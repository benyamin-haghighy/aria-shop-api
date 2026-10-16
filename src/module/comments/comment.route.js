const express = require('express')
const controller = require('./comment.controller')
const passport = require('passport')
const router = express.Router()

router.route('/all')
    .get(passport.authenticate('adminUser', {session:false}),controller.getAllComments)

router.route('/product/:id')
    .post(passport.authenticate('accessToken', {session:false}),controller.create)
    .get(passport.authenticate('accessToken', {session:false}),controller.getAll)


router.route('/reply/:id')
    .patch(passport.authenticate('accessToken', {session:false}),controller.updateReply)
    .delete(passport.authenticate('adminUser', {session:false}),controller.deleteReply)


router.route('/:id/reply')
    .post(passport.authenticate('accessToken', {session:false}),controller.reply)
    .get(passport.authenticate('accessToken', {session:false}),controller.getReply)
    


router.route('/:id')
    .patch(passport.authenticate('accessToken', {session:false}),controller.update)
    .delete(passport.authenticate('adminUser', {session:false}),controller.delete)

module.exports = router