const express = require('express')
const shopController = require('../controller/shop')
const router = express.Router()

router.get('/', shopController.getIndex )
router.get('/cart', shopController.getCart)
router.post('/cart', shopController.postCart)
router.post('/cart-delete-item', shopController.postDeleteCartProduct)
router.get('/orders', shopController.getOrders)
router.get('/checkout', shopController.getCheckout)
router.get('/product-list', shopController.getProductList)
router.get('/product/:id', shopController.getProductDetails)

module.exports = router