const express = require('express')
const auth = require('../controller/auth')
const router = express.Router()
router.get('/login', auth.getLogin)
router.post('/login', auth.postLogin)
router.post('/logout', auth.postLogout)

module.exports = router