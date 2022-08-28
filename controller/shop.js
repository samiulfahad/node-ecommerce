const { Product, OrderItem } = require('../models/models')
const Cart = require('../models/cart')

exports.getIndex = async (req, res) => {
    const products = await Product.findAll()
    res.render('./shop/index', {title: 'Home', prods: products, path: '/'})
}

exports.getProductList = async (req, res) => {
    const products = await Product.findAll()
    res.render('./shop/product-list', {title: 'Product List', prods: products,path: '/product-list' })
}
exports.getCart = async (req, res) => {
    try{
        const cart = await req.user.getCart()
        const products = await cart.getProducts()
        res.render('./shop/cart', {title: 'Your Cart', products, path: '/cart'})
    }
    catch(err){
        console.log(err)
    }
}
exports.postCart = async (req, res) => {
    const id = parseInt(req.body.productId)
    const qty = parseInt(req.body.quantity)
    try{
        let product = await Product.findByPk(id)
        let cart = await req.user.getCart()
        const cartProducts = await cart.getProducts()
        const cartProd = cartProducts.find( prod =>   prod.dataValues.id === id)
        if(cartProd){
            let oldQty = cartProd.cartItem.quantity
            await cart.addProduct(product, {through: {quantity: oldQty + qty}})
        } else {
            await cart.addProduct(product, {through: {quantity: qty}})
        }
        res.redirect('/cart')
    }
    catch(err){
        console.log(err)
    }
}

exports.postOrder =  async (req, res) => {
    try{
        const cart = await req.user.getCart()
        let cartProducts = await cart.getProducts()
        let orderProducts = []
        const order = await req.user.createOrder()
        cartProducts.forEach( async prod => {
            prod.orderItem = {quantity: prod.cartItem.quantity}
            await order.addProduct(prod)
        })
        await cart.setProducts([])
        res.redirect('/orders')
    }
    catch(e){

    }
}

exports.getOrders = async (req, res) => {
    try{
        const orders = await req.user.getOrders({include: Product})
        res.render('./shop/orders', {title: 'Your Orders',orders, path: '/orders'})
    }
    catch(err){
        console.log(err)
    }
}

exports.postDeleteCartProduct = async (req, res) => {
    const id = parseInt(req.body.productId)
   try{
        const cart = await req.user.getCart()
        const products = await cart.getProducts({where: {id: id}})
        const product = products[0]
        await product.cartItem.destroy()
        res.redirect('/cart')
   } catch(err){
    console.log(err)
   }
}
// exports.getOrders = async (req, res) => {
//     res.render('./shop/orders', {title: 'Your Orders', path: '/orders'})
// }
exports.getCheckout = async (req, res) => {
    res.render('./shop/checkout', {title: 'Checkout', path: '/checkout'})
}
exports.getProductDetails = async (req, res) => {
    const id = req.params.id
    try{
        const product = await Product.findByPk(id)
        return res.render('./shop/product-details.ejs', {title: 'Product', product, path: '/single-product' })
    }
    catch(err) {
        console.log(err)
    }
}
