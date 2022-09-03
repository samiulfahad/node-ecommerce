const express = require('express')
const shopController = require('../controller/shop')
const router = express.Router()

router.get('/', shopController.getIndex )
router.get('/cart', shopController.getCart)
router.post('/cart', shopController.postCart)
router.post('/cart-delete-item', shopController.postDeleteCartItem)
router.post('/create-order', shopController.postOrder)
router.get('/orders', shopController.getOrders)
router.get('/checkout', shopController.getCheckout)
router.get('/products', shopController.getProducts)
router.get('/product/:id', shopController.getProductDetails)

module.exports = router