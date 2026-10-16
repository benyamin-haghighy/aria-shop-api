const express = require('express')
const controller = require('./shortLink.controller')
const router = express.Router()
router.route('/:shortIdentifire')
    .get(controller.get)
module.exports = router