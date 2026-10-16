const express = require('express')
const controller = require('./location.controller')
const passport = require('passport')
const router = express.Router()

router.route('/city')
    .get(controller.getAllCtiy)


router.route('/provinces')
    .get(controller.getAllProvinces)
module.exports = router