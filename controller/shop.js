const Product = require('../models/product')
const Cart = require('../models/cart')

exports.getIndex = async (req, res) => {
    const products = await Product.fetchAll()
    res.render('./shop/index', {title: 'Home', prods: products, path: '/'})
}

exports.getProductList = async (req, res) => {
    const products = await Product.fetchAll()
    res.render('./shop/product-list', {title: 'Product List', prods: products,path: '/product-list' })
}
exports.getCart = async (req, res) => {
    const cart = await Cart.getCart()
    res.render('./shop/cart', {title: 'Your Cart', products: cart.products, path: '/cart'})
}
exports.postCart = async (req, res) => {
    let unit = parseInt(req.body.unit)
    await Cart.addToCart(req.body.productId, unit=1)
    res.redirect('/cart')
}

//Delete a product from cart
exports.postDeleteCartProduct = async (req, res) => {
    const productId = req.body.productId
    await Cart.deleteCartProduct(req.body.productId)
    res.redirect('/cart')
}

exports.getOrders = async (req, res) => {
    res.render('./shop/orders', {title: 'Your Orders', path: '/orders'})
}
exports.getCheckout = async (req, res) => {
    res.render('./shop/checkout', {title: 'Checkout', path: '/checkout'})
}
exports.getProductDetails = async (req, res) => {
    const _id = req.params.id
    const product = await Product.findById(_id)
    res.render('./shop/product-details', {title: 'Product Details', path: '/product', product})
}
