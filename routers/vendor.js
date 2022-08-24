const express = require('express')
const vendorController = require('../controller/vendor')
const router = express.Router()

router.get('/add-product', vendorController.getAddProduct)
router.post('/add-product', vendorController.postAddProduct)
router.get('/edit-product/:id', vendorController.getEditProduct)
router.post('/edit-product', vendorController.postEditProduct)
router.post('/delete-product', vendorController.postDeleteProduct)
router.get('/products', vendorController.getProducts)

module.exports = router