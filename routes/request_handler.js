const express = require('express')

const router = express.Router()

const {process_request} = require('../controllers/process_request')

router.route('/').post(process_request)

module.exports = router