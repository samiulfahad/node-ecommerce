const { Product, Order } = require('../models/models')

exports.getIndex = async (req, res) => {
    const products = await Product.find()
    res.render('./shop/index', {title: 'Home', products, path: '/', 
    isLoggedIn: req.session.isLoggedIn})
}

exports.getProducts = async (req, res) => {
    const products = await Product.find()
    res.render('./shop/products', {title: 'Product List', products, path: '/products', 
    isLoggedIn: req.session.isLoggedIn })
}
exports.getCart = async (req, res) => {
    try{
        await req.user.populate('cart.items.productId')
        const cartProducts = req.user.cart.items
        res.render('./shop/cart', {title: 'Your Cart', products: cartProducts, 
        path: '/cart', isLoggedIn: req.session.isLoggedIn})
    }
    catch(err){
        console.log(err)
    }
}
exports.postCart = async (req, res) => {
    try{
        let product = await Product.findById(req.body.productId)
        if(product){
            await req.user.addToCart(req.body.productId, parseInt(req.body.quantity))
        }
        res.redirect('/cart')
    }
    catch(err){
        console.log(err)
    }
}

exports.postOrder =  async (req, res) => {
    try{
        await req.user.populate('cart.items.productId', 'title price quantity -_id')
        const cartProds = await req.user.cart.items
        let cartItems = cartProds.map(item => {
            let title = item.productId.title
            let price = item.productId.price
            let quantity = item.quantity
            return {title, price, quantity}
        })
        const userOrder = await Order.create({items: cartItems, userId: req.user._id})
        req.user.cart.items = []
        await req.user.save()
        res.redirect('/orders')
    }
    catch(e){

    }
}

exports.getOrders = async (req, res) => {
    try{
       const orders = await Order.find({userId: req.user._id}).populate('userId', 'name email')
       res.render('./shop/orders', {title: 'Your Orders',orders, 
       path: '/orders', isLoggedIn: req.session.isLoggedIn})
    }
    catch(err){
        console.log(err)
    }
}

exports.postDeleteCartItem = async (req, res) => {
   try{
        req.user.cart.items = req.user.cart.items.filter(item => {
            return item.productId.toString() !== req.body.productId.toString()
        })
        await req.user.save()
        res.redirect('/cart')
   } catch(err){
    console.log(err)
   }
}

exports.getCheckout = async (req, res) => {
    res.render('./shop/checkout', {title: 'Checkout', path: '/checkout', 
    isLoggedIn: req.session.isLoggedIn})
}
exports.getProductDetails = async (req, res) => {
    try{
        const product = await Product.findById(req.params.id)
        return res.render('./shop/product-details.ejs', {title: 'Product', product, 
        path: '/single-product', isLoggedIn: req.session.isLoggedIn })
    }
    catch(err) {
        console.log(err)
    }
}
