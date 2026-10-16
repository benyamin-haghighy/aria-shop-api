const express = require('express')
const controller = require('./note.controller')
const passport = require('passport')
const router = express.Router()



router.route('/')
    .post(passport.authenticate('accessToken', {session:false}),controller.createOrUpdate)
    .get(passport.authenticate('accessToken', {session:false}), controller.getAll)
router.route('/:id')
    .get(passport.authenticate('accessToken', {session:false}),controller.getOne)
    .delete(passport.authenticate('accessToken', {session:false}),controller.del)
    .put(passport.authenticate('accessToken', {session:false}), controller.update)

module.exports = router